import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: AuthDto) {
    const user = await this.validateUser(loginDto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async register(registerDto: AuthDto) {
    const oldUser = await this.userService.getByEmail(registerDto.email);
    if (oldUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.userService.createUser(registerDto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.getById(result.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verify(user.password as string, dto.password);
    if (!isPasswordValid) {
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
    }

    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      secure: true,
      expires: expiresIn,
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
    });
  }

  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get<string>('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
    });
  }
}
