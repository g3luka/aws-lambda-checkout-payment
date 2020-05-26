import { Injectable, HttpService } from '@nestjs/common';
import { stringify as queryStringify } from 'querystring';
import { parseStringPromise } from 'xml2js';
import { CheckoutRequest } from '../../types/requests/checkout.request';
import { CheckoutFormDataRequest } from '../../types/requests/checkout.formdata.request';

const ENV = process.env.STAGE || 'stg';

@Injectable()
export class PagSeguroProvider {

  constructor(
    private readonly httpService: HttpService,
  ) {}

  static readonly PAGSEGURO = {
    prd: {
      WS: "https://ws.pagseguro.uol.com.br/v2/checkout/",
      PG: "https://pagseguro.uol.com.br/v2/checkout/",
    },
    stg: {
      WS: "https://ws.sandbox.pagseguro.uol.com.br/v2/checkout/",
      PG: "https://sandbox.pagseguro.uol.com.br/checkout/v2/",
    },
    CREDENTIALS: {
      email: process.env.PAGSEGURO_EMAIL,
      token: process.env.PAGSEGURO_TOKEN
    }
  };

  /**
   * Processa a operação completa de checkout
   */
  async create(request: CheckoutRequest) {
    return {
      redirectLink: this.checkoutWithFixedLinks(request)
    };
    // const codeResponse = await this.createCheckoutCode(request);
    // return {
    //   redirectLink: this.getCheckoutLink(codeResponse.code),
    //   code: codeResponse.code,
    // };
  }

  /**
   * Retorna o link fixo pelo valor do pedido
   */
  checkoutWithFixedLinks(checkout: CheckoutRequest) {
    const priceToLink = {
      5: "https://pag.ae/7VXieMsSa",
      7: "https://pag.ae/7VZLfBATM",
      10: "https://pag.ae/7VYdKNjga",
      15: "https://pag.ae/7VZm86vEr",
    }
    const total = this.getTotal(checkout);
    return priceToLink[total];
  }

  /**
   * Recebe a notificação do PagSeguro quando uma transação é alterada ou gerada
   */
  async notification(request) {
    return request;
  }

  /**
   * Cria um novo checkout
   */
  async createCheckoutCode(checkout: CheckoutRequest) {
    try {
      const endpoint = PagSeguroProvider.PAGSEGURO[ENV].WS+'?'+queryStringify(PagSeguroProvider.PAGSEGURO.CREDENTIALS);
      const requestBody = this.convertRequestToFormData(checkout);
      const response = await this.httpService.post(endpoint, requestBody, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        responseType: 'text',
        transformResponse: [async (response) => await parseStringPromise(response)]
      }).toPromise();
      const checkoutCode = await response.data;
      return {
        code: checkoutCode.checkout.code.pop(),
        date: checkoutCode.checkout.date.pop()
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Pega o Link do checkout para redirecionar o usuário
   */
  getCheckoutLink(checkoutCode: string): string {
    return PagSeguroProvider.PAGSEGURO[ENV].PG+'payment.html?code='+checkoutCode;
  }

  /**
   * Converte um object para querystring para usar com FormData
   */
  convertRequestToFormData(request: CheckoutRequest) {
    const data = new CheckoutFormDataRequest();
    data.fromCheckout(request);
    const response = {};
    Object.assign(response, data);
    return queryStringify(response);
  }

  /**
   * Retorna o valor total do checkout
   */
  getTotal(checkout: CheckoutRequest) {
    return checkout.items.reduce(function (acc, item) {
      if ( ! acc.total) acc.total = 0;
      acc.total += item.amount * item.quantity;
      return acc;
    }, checkout.items[0]).total;
  }

}
