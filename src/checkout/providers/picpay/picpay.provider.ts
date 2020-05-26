import { GatewayProvider } from "../contracts/gateway.contract";
import { CheckoutRequest } from "src/checkout/types/requests/checkout.request";
import { Item } from "src/checkout/types/item";
import { HttpService, Injectable } from "@nestjs/common";
type Method = |'get'|'GET'|'delete'|'DELETE'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'link'|'LINK'|'unlink'|'UNLINK';

@Injectable()
export class PicPayProvider implements GatewayProvider {

  private picpay: any

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.picpay = {
      baseUrl: 'https://appws.picpay.com/ecommerce/public',
      sellerToken: process.env.PICPAY_SELLER_TOKEN,
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "Content-Type": "application/json;charset=utf-8",
        "x-picpay-token": process.env.PICPAY_TOKEN,
      }
    }
  }

  /**
   * Cria um novo link de checkout
   *
   * @param request Request com os dados do checkout
   */
  async create(request: CheckoutRequest) {
    try {
      const body = this.fromRequest(request);
      const response = await this.api('payments', body);
      return {
        redirectLink: response.paymentUrl,
        ...response
      };
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Abstração da conexão com a API do PicPay
   *
   * @param endpoint Endpoint da api do PacPay
   * @param body Conteúdo da requisição
   * @param method Método HTTP
   */
  async api(endpoint: string, body: any, method: Method = 'post') {
    const response = await this.httpService.request({
      method: method,
      baseURL: this.picpay.baseUrl,
      url: endpoint,
      data: body,
      headers: this.picpay.headers
    }).toPromise();
    return await response.data;
  }

  /**
   * Converte a request para o formato aceito pela api do PicPay
   *
   * @param request Request contendo os dados do checkout
   */
  fromRequest(request: CheckoutRequest) {
    let amount = 0;
    if (request.items.length) {
      request.items.forEach((item: Item) => {
        amount += item.amount * (item.quantity || 1);
      });
    };

    return {
      "referenceId": request.reference,
      "callbackUrl": "https://rest.tribunapr.com.br/v1/checkout/notification/picpay",
      "returnUrl": request.redirectURL,
      "value": amount,
      "expiresAt": null,
      "buyer": {
        "firstName": request.sender.name,
        "lastName": request.sender.surname,
        "document": request.sender.documents[0].value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"),
        "email": request.sender.email,
        "phone": `+55 ${request.sender.phone.areaCode} ${request.sender.phone.number.toString().replace(/^(\d{5})(\d{4})$/, "$1-$2")}`
      }
    }
  }

  /**
   * Recebe a notificação com a transação
   *
   * @param request Dados da request
   */
  async notification(request) {
    console.info('PICPAY NOTIFICATION');
    if (request.headers['x-seller-token'] !== this.picpay.sellerToken) return false;
    console.log(request);

    return {
      ...request.body
    }
  }

}
