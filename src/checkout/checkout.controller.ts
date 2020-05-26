import { Controller, Post, Body, Request, Response, Param, Get, UseGuards, UseFilters } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutRequest } from './types/requests/checkout.request';
import { ApiResponse } from './types/responses/response';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Unauthorized } from 'src/auth/auth.filter';

@Controller('v1/checkout')
export class CheckoutController {

  constructor(private readonly service: CheckoutService) {}

  @Post('donation')
  async createTransaction(@Body() checkout: CheckoutRequest) {
    // console.log(checkout);
    const response = await this.service.process(checkout);

    return new ApiResponse()
      .setMessage("Processado com sucesso.")
      .setData(response);
  }

  @Post('notification/:gateway')
  async picpayNotification(@Request() request, @Param('gateway') gateway) {
    this.service.notification(request, gateway);
    return new ApiResponse()
      .setMessage("Recebido!")
      .setData({
        gateway,
        headers: request.headers,
        body: request.body,
      });
  }

  @Get('export')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(Unauthorized)
  async export(@Response() res) {
    const csv = await this.service.exportCsv({ select: [
      "id",
      "customerName",
      "customerSurname",
      "customerEmail",
      "customerCpf",
      "amount",
      "recurrence",
      "status",
      "gateway",
      "createdAt",
    ] });
    const date = `${new Date().toJSON().substr(0, 10)}-${new Date().toLocaleTimeString().substr(0, 5).replace(/[:]/g, '-')}`;
    res.set('Content-Type', 'application/octet-stream');
    res.attachment(`tribuna-doacoes-${date}.csv`);
    res.send(Buffer.from(csv));
    // return csv.toString();
  }

}
