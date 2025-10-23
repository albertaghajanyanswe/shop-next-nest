import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion(process.env.npm_package_version || '1.0.0')
    .addBearerAuth()
    .build();
}
