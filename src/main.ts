import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as cookieSession from 'cookie-session';
import * as passport from 'passport';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { cors: true }
  );

  app.use(cookieParser())
  app.use(cookieSession({
    name: 'tribuna:sess',
    secret: process.env.COOKIE_SESSION_SECRET,
    maxAge: 1000 * 60 * 5 // 5 minutes
    // maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}

bootstrap();
