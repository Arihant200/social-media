import * as dotenv from 'dotenv';
dotenv.config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
                 // If using cookies
  });
  app.useGlobalPipes(new ValidationPipe());
  //  console.log('JWT_SECRET from .env in main.ts:', process.env.JWT_SECRET); 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
