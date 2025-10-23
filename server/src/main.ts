import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieParser from 'cookie-parser';
import { raw, json } from 'body-parser';
import { Logger } from '@nestjs/common';
import { getSwaggerConfig } from './config';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(AppModule.name);
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.use('/api/stripe/webhook', raw({ type: 'application/json' }));
  app.use(json({ limit: '10mb' }));

  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const swaggerConfig = getSwaggerConfig();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    jsonDocumentUrl: 'api/openapi.json',
  });

  try {
    await app.listen(process.env.PORT ?? 4000);
    logger.log(`Server is running on port ${process.env.PORT ?? 4000}`);
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, error);
    process.exit(1);
  }
}
bootstrap();
