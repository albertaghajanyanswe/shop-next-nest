// src/auth/guards/ws-jwt.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
    console.log('\n\n WS GUARD');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];
    console.log('\n\n token = ', token);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('PAYLOAD = ', payload);
      // сохраняем пользователя в socket
      client.data.user = payload;
      console.log('\n\n\n ADD USER WS ', client.data.user);
      return true;
    } catch (err) {
      console.log('ERR = ', err);
      client.disconnect();
      throw new UnauthorizedException('Invalid token');
    }
  }
}
