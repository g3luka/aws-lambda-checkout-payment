import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutModule } from './checkout/checkout.module';
import { PanelModule } from './panel/panel.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // logging: ["warn", "error", "query"],
      logging: ["error"],
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CheckoutModule,
    PanelModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
