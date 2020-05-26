import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Checkout } from './entities/checkout.entity';
import { CheckoutRequest } from './types/requests/checkout.request';
import { PagSeguroProvider } from './providers/pagseguro/pagseguro.provider';
import { MercadoPagoProvider } from './providers/mercadopago/mercadopago.provider';
import { PicPayProvider } from './providers/picpay/picpay.provider';
import { GatewayProvider } from './providers/contracts/gateway.contract';
import { writeToBuffer } from '@fast-csv/format';

@Injectable()
export class CheckoutService {

  constructor(
    @InjectRepository(Checkout)
    private readonly repository: Repository<Checkout>,
    private readonly pagseguroProvider: PagSeguroProvider,
    private readonly mercadopagoProvider: MercadoPagoProvider,
    private readonly picpayProvider: PicPayProvider,
  ) {}

  async process(request: CheckoutRequest) {
    try {

      /**
       * Salva no banco de dados
       */
      const checkout = new Checkout().fromRequest(request);
      await this.post(checkout);
      const response = {
        checkoutId: checkout.id
      };

      /**
       * Envia para o Gateway processar
       */
      if (request.gateway !== 'transfer') {
        const service = this.getProvider(request.gateway);
        request.reference = `TRB-${process.env.ENV.toUpperCase()}-${checkout.id}`;
        const serviceResponse = await service.create(request);
        Object.assign(response, serviceResponse);
      }

      /**
       * Retorno
       */
      return response;

    } catch (error) {
      console.info('CHECKOUT SERVICE CATCH');
      // console.error(error.request.res);
      throw {
        errors: [
          error
        ]
      }
    }
  }

  /**
   * Recebe a notificação do gateway sobre uma transação
   *
   * @param request Dados da requisição
   * @param gateway Gateway de pagamento
   */
  async notification(request, gateway: string) {
    const service = this.getProvider(gateway);
    await service.notification(request);
  }

  async get(options?: object): Promise<Checkout[]> {
    return await this.repository.find(options);
  }

  async post(checkout: Checkout) {
    return await this.repository.save(checkout);
  }

  async put(id: number, checkout: Checkout) {
    return await this.repository.update(id, checkout);
  }

  async delete(id: number) {
    return await this.repository.delete(id);
  }

  getProvider(gateway: string): GatewayProvider {
    return this[`${gateway}Provider`];
  }

  /**
   * Exporta em CSV a planilha de registros de checkout
   */
  async exportCsv(filter: object | null) {
    const rows = await this.get(filter);
    return await writeToBuffer(rows, { headers: true, writeHeaders: true });
  }

}
