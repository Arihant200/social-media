// src/main.ts
import * as dotenv from 'dotenv';
dotenv.config(); // Keep for local development if you use .env files there

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import type { VercelRequest, VercelResponse } from '@vercel/node'; // Recommended types

let cachedApp: INestApplication;

async function bootstrapServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      // Your CORS options
    });
    app.useGlobalPipes(new ValidationPipe());
    // app.setGlobalPrefix('api'); // Optional: If you want all NestJS routes to automatically be prefixed
    await app.init(); // CRITICAL for serverless
    cachedApp = app;
  }
  return cachedApp;
}

export default async function (req: VercelRequest, res: VercelResponse) { // Use VercelRequest, VercelResponse if types installed
  const app = await bootstrapServer();
  await app.getHttpAdapter().getInstance()(req, res);
}