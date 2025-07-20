// src/main.ts
import * as dotenv from 'dotenv';
// IMPORTANT: dotenv.config() is generally not needed on Vercel
// as Vercel injects environment variables directly.
// It's fine to keep for local development, but Vercel won't use your .env file.
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
// If you want type safety for Vercel's request/response objects, install:
// npm install --save-dev @types/vercel__node
// import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: INestApplication; // This will cache the NestJS app instance

async function bootstrapServer() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      // Your CORS options
    });
    app.useGlobalPipes(new ValidationPipe());

    // Optional: If you want all your NestJS routes to automatically be prefixed with /api
    // app.setGlobalPrefix('api');

    await app.init(); // <--- CRITICAL for serverless: This initializes all NestJS modules, providers, controllers
    cachedApp = app;
  }
  return cachedApp;
}

// This is the exported handler function that Vercel will call for each incoming request
export default async function (req: any, res: any) { // Use any for req/res if @types/vercel__node is not installed
  const app = await bootstrapServer();
  // Get the underlying HTTP adapter (e.g., Express or Fastify) and pass the request/response to it
  await app.getHttpAdapter().getInstance()(req, res);
}