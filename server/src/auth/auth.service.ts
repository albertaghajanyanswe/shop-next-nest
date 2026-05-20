import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { verify, hash } from 'argon2';
import { StripeService } from 'src/payment/provider/stripe/stripe.service';
import { MailerService } from 'src/mailer/mailer.service';
import { EnvVariables } from 'src/utils/constants/variables';
import { EnumRole, EnumSubscriptionType } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';
  ACCESS_TOKEN_NAME = 'accessToken';

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async register(registerDto: RegisterDto) {
    const oldUser = await this.userService.getByEmail(registerDto.email);
    if (oldUser) {
      this.logger.error(
        `Registration attempt with existing email: ${registerDto.email}`,
      );
      throw new BadRequestException('User already exists');
    }

    const user = await this.userService.createUser(registerDto);
    const tokens = this.issueTokens(user.id);

    await this.stripeService.createCustomer(user.id);

    const plan = await this.prismaService.plan.findFirst({
      where: { planId: EnumSubscriptionType.FREE },
    });
    if (!plan) {
      throw new NotFoundException('Free plan not found');
    }
    try {
      await this.stripeService.createCheckoutSessionSubscription(user, plan);
    } catch (e) {
      this.logger.error(
        `Failed to create Stripe subscription for user ${user.id}: ${e.message}`,
      );
    }

    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) {
      this.logger.error('Invalid refresh token provided for token refresh.');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getById(result.id);
    if (!user) {
      this.logger.error(
        `User with ID ${result.id} not found during token refresh.`,
      );
      throw new NotFoundException('User not found');
    }
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  issueTokens(userId: string, role: EnumRole = EnumRole.USER) {
    const data = { id: userId, role };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: RegisterDto | LoginDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) {
      this.logger.error(`Login attempt with non-existent email: ${dto.email}`);
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verify(user.password as string, dto.password);
    if (!isPasswordValid) {
      this.logger.error(`Invalid password attempt for email: ${dto.email}`);
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async validateOAuthLogin(req: any) {
    let user = await this.userService.getByEmail(req.user.email);
    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          name: req.user.name,
          email: req.user.email,
          picture: req.user.picture,
        },
        include: { stores: true, favorites: true, orders: true },
      });
      await this.prismaService.store.create({
        data: {
          title: 'Free Store',
          description:
            'IMPORTANT:Only this store and his products should be shown in free plan',
          userId: user.id,
          isDefaultStore: true,
        },
      });

      await this.stripeService.createCustomer(user.id);

      const plan = await this.prismaService.plan.findFirst({
        where: { planId: EnumSubscriptionType.FREE },
      });
      if (!plan) {
        throw new NotFoundException('Free plan not found');
      }
      try {
        await this.stripeService.createCheckoutSessionSubscription(user, plan);
      } catch (e) {
        this.logger.error(
          `Failed to create Stripe subscription for user ${user.id}: ${e.message}`,
        );
      }
    }

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.getByEmail(forgotPasswordDto.email);
    if (!user) {
      this.logger.warn(`Password reset requested for non-existent email: ${forgotPasswordDto.email}`);
      return { success: true, message: 'If email exists, reset link will be sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      } as any,
    });

    await this.mailerService.sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetToken,
    });

    return { success: true, message: 'If email exists, reset link will be sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        resetToken: resetPasswordDto.token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      } as any,
    });

    if (!user) {
      this.logger.error('Invalid or expired reset token');
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await hash(resetPasswordDto.password);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      } as any,
    });

    return { success: true, message: 'Password reset successfully' };
  }

  checkSecureCookie() {
    const isSecure =
      process.env.NODE_ENV === 'production' ||
      process.env.SERVER_DOMAIN === 'localhost';
    return isSecure;
  }

  addAccessTokenToResponse(res: Response, accessToken: string) {
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1);
    res.cookie(this.ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      ...(this.checkSecureCookie()
        ? { domain: this.configService.get<string>(EnvVariables.SERVER_DOMAIN) }
        : {}),
      secure: this.checkSecureCookie() ? true : false,
      expires: expiresIn,
      sameSite: 'lax',
    });
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    /*
     * TODO - Cookie temporary solution
     * 1. Need to add domain in any NODE_ENV
     * 2. secure always set true for prod
     */
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      ...(this.checkSecureCookie()
        ? { domain: this.configService.get<string>(EnvVariables.SERVER_DOMAIN) }
        : {}),
      secure: this.checkSecureCookie() ? true : false,
      expires: expiresIn,
      sameSite: 'lax',
    });
  }

  removeAccessTokenFromResponse(res: Response) {
    res.cookie(this.ACCESS_TOKEN_NAME, '', {
      httpOnly: true,
      ...(this.checkSecureCookie()
        ? { domain: this.configService.get<string>(EnvVariables.SERVER_DOMAIN) }
        : {}),
      expires: new Date(0),
      secure: this.checkSecureCookie() ? true : false,
      sameSite: 'lax',
    });
  }

  removeRefreshTokenToResponse(res: Response) {
    /*
     * TODO - Cookie temporary solution
     * 1. Need to add domain in any NODE_ENV
     * 2. secure always set true for prod
     */
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      ...(this.checkSecureCookie()
        ? { domain: this.configService.get<string>(EnvVariables.SERVER_DOMAIN) }
        : {}),
      expires: new Date(0),
      secure: this.checkSecureCookie() ? true : false,
      sameSite: 'lax',
    });
  }
}
