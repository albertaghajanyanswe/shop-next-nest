import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/utils/constants/variables';

export function getMailerConfig(configService: ConfigService) {
  return {
    host: configService.get<string>(EnvVariables.MAIL_HOST),
    port: configService.get<number>(EnvVariables.MAIL_PORT),
    secure: configService.get<string>(EnvVariables.MAIL_PORT) === '465', // true for 465, false for other ports
    ignoreTLS: configService.get<string>(EnvVariables.MAIL_PORT) === '465',
    auth: {
      user: configService.get<string>(EnvVariables.MAIL_USER),
      pass: configService.get<string>(EnvVariables.MAIL_PASSWORD),
    },
  };
}
