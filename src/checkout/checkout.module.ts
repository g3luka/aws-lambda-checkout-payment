import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { Checkout } from './entities/checkout.entity';

import { PagSeguroProvider } from './providers/pagseguro/pagseguro.provider';
import { MercadoPagoProvider } from './providers/mercadopago/mercadopago.provider';
import { PicPayProvider } from './providers/picpay/picpay.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Checkout
    ]),
    HttpModule,
  ],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    PagSeguroProvider,
    MercadoPagoProvider,
    PicPayProvider
  ],
})
export class CheckoutModule {}
