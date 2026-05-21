import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ type: AuthResponseDto })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken, ...response } =
      await this.authService.login(loginDto);

    this.authService.addAccessTokenToResponse(res, accessToken);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiOkResponse({ type: AuthResponseDto })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken, ...response } =
      await this.authService.register(registerDto);

    this.authService.addAccessTokenToResponse(res, accessToken);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @ApiOperation({ summary: 'User login access token' })
  @ApiOkResponse({ type: AuthResponseDto })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookie =
      req.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookie) {
      this.authService.removeAccessTokenFromResponse(res);
      this.authService.removeRefreshTokenToResponse(res);
      throw new UnauthorizedException('Refresh token is missing');
    }

    const { refreshToken, accessToken, ...response } =
      await this.authService.getNewTokens(refreshTokenFromCookie);

    this.authService.addAccessTokenToResponse(res, accessToken);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeAccessTokenFromResponse(res);
    this.authService.removeRefreshTokenToResponse(res);
    return { message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Request password reset' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.requestPasswordReset(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Reset password with token' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req) {
    console.log('\n\n Google OAuth started');
  }

  /*Create credetials here https://console.cloud.google.com/apis/credentials?authuser=1&project=shop-dev-468813&supportedpurview=project
# 1. Click Create credetials
# 2. OAuth client ID
# 3. Web app
# 4. Authorized JavaScript origins - set <server_url> (e.g. http://localhost:4000)
# 5. Authorized redirect URIs - set <server_url>/auth/google/callback(e.g. http://localhost:4000/auth/google/callback)
# 6. Update env GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
*/

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken, ...response } =
      await this.authService.validateOAuthLogin(req);

    this.authService.addAccessTokenToResponse(res, accessToken);
    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return res.redirect(`${process.env['CLIENT_URL']}/dashboard/settings`);
  }
}
