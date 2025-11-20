import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { EnvVariables } from 'src/utils/constants/variables';

export const getJwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get<string>(EnvVariables.JWT_SECRET),
    signOptions: {
      expiresIn: configService.get<string>(EnvVariables.JWT_EXPIRES_IN) as any ?? '7d',
    },
  };
}