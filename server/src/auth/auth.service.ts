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
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { StripeService } from 'src/payment/provider/stripe/stripe.service';
import { EnvVariables } from 'src/utils/constants/variables';
import { EnumRole, EnumSubscriptionType } from '@prisma/client';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
    private readonly stripeService: StripeService,
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
    }

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  checkSecureCookie() {
    const isSecure =
      process.env.NODE_ENV === 'production' ||
      process.env.SERVER_DOMAIN === 'localhost';
    return isSecure;
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
