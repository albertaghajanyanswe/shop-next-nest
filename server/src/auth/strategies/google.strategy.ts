import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    if (!clientID) {
      throw new Error('GOOGLE_CLIENT_ID is not defined in environment variables');
    }
    if (!clientSecret) {
      throw new Error('GOOGLE_CLIENT_SECRET is not defined in environment variables');
    }

    super({
      clientID,
      clientSecret,
      callbackURL:
        configService.get<string>('SERVER_URL') + '/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { displayName, emails, photos } = profile;
    const user = {
      name: displayName,
      email: emails?.length ? emails[0].value : '',
      picture: photos?.length ? photos[0].value : '',
    };
    done(null, user);
  }
}
