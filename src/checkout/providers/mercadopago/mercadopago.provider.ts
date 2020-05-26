/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import mercadopago = require('mercadopago');
import { CheckoutRequest } from 'src/checkout/types/requests/checkout.request';
import { GatewayProvider } from '../contracts/gateway.contract';
import { Item } from 'src/checkout/types/item';

@Injectable()
export class MercadoPagoProvider implements GatewayProvider {

  constructor() {
    // Configura credenciais
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });
  }

  async create(request: CheckoutRequest) {
    try {
      const checkout = this.fromRequest(request);
      const response = await mercadopago.preferences.create(checkout);
      return {
        redirectLink: response.body.init_point,
        ...response.body
      };
    } catch(error) {
      console.info('MERCADOPAGO SERVICE CATCH');
      console.error(error);
    }
  }

  async notification(request) {
    return request;
  }

  fromRequest(request: CheckoutRequest) {
    const checkout = {
      payer: {},
      items: [],
      back_urls: {
        success: request.redirectURL || "https://www.tribunapr.com.br/apoie/",
        failure: request.redirectURL || "https://www.tribunapr.com.br/apoie/",
        pending: request.redirectURL || "https://www.tribunapr.com.br/apoie/",
      },
      auto_return: "approved",
      payment_methods: {
        installments: 1,
        excluded_payment_types: [
          {
            id: "ticket"
          },
        ],
      },
      external_reference: request.reference || null,
      // notification_url: "https://www.tribunapr.com.br/apoie/"
    };

    if (request.sender != null) {
      checkout.payer = {
        name: request.sender?.name,
        surname: request.sender?.surname,
        email: request.sender?.email || null,
        identification: {
          type: request.sender?.documents[0]['type'] || 'CPF',
          number: request.sender?.documents[0]['value'] || null
        }
      }
    }

    if (request.items.length) {
      request.items.forEach((rItem: Item) => {
        checkout.items.push({
          id: rItem.id || null,
          title: rItem.description,
          unit_price: rItem.amount,
          quantity: rItem.quantity || 1,
          currency_id: 'BRL',
        });
      });
    }

    return checkout;
  }

}
