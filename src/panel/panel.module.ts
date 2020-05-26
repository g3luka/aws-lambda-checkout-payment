import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { PanelController } from './panel.controller';

import { CheckoutService } from 'src/checkout/checkout.service';
import { Checkout } from 'src/checkout/entities/checkout.entity';

import { PagSeguroProvider } from 'src/checkout/providers/pagseguro/pagseguro.provider';
import { MercadoPagoProvider } from 'src/checkout/providers/mercadopago/mercadopago.provider';
import { PicPayProvider } from 'src/checkout/providers/picpay/picpay.provider';

@Module({
  controllers: [PanelController],
  imports: [
    TypeOrmModule.forFeature([
      Checkout
    ]),
    HttpModule,
  ],
  providers: [
    CheckoutService,
    PagSeguroProvider,
    MercadoPagoProvider,
    PicPayProvider
  ],
})
export class PanelModule {}
