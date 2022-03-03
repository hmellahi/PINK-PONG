import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const gloabalPrefix = 'api';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(gloabalPrefix);
  app.use(cookieParser());
  app.enableCors({ origin: `${process.env.HOST}:5000`, credentials: true }); // to update
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  await app.listen(3000);
}
bootstrap();
