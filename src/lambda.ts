// lambda.ts
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';

import * as cookieParser from 'cookie-parser';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';

import { join } from 'path';
import { AppModule } from './app.module';

import express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = ['image/png'];

let cachedServer: Server;

async function bootstrap(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    // const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp))

    app.use(cookieParser())
    app.use(cookieSession({
      name: 'tribuna:sess',
      secret: process.env.COOKIE_SESSION_SECRET,
      maxAge: 1000 * 60 * 5 // 5 minutes
      // maxAge: 1000 * 60 * 60 * 8 // 8 hours
    }))
    app.use(passport.initialize())
    app.use(passport.session())

    app.enableCors();
    app.use(eventContext());

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    await app.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrap();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
}
