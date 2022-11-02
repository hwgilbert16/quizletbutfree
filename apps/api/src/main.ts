import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as http from "http";
import * as express from 'express';
import { ExpressAdapter } from "@nestjs/platform-express";

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, disableErrorMessages: true }));

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  if (process.env.SSL_KEY_PATH && process.env.SSL_KEY_PATH.length > 0) {
    https.createServer({
      key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH)),
      cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH))
    }, server).listen(443);
  }

  const port = process.env.PORT || 3333;
  await app.init();

  http.createServer(server).listen(port);
}

bootstrap();
