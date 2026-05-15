import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { EnvVariables } from "src/utils/constants/variables";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService
  ) {
      const jwtSecret = configService.get<string>(EnvVariables.JWT_SECRET);
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      super({
        jwtFromRequest: (req) => {
          // Try to extract from Authorization header first
          const fromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
          if (fromHeader) return fromHeader;

          // If not found, try to extract from cookies
          return req.cookies?.accessToken || null;
        },
        ignoreExpiration: true,
        secretOrKey: jwtSecret,
      });
  }

  async validate({ id }: { id: string }) {
    return this.userService.getById(id);
  }

}