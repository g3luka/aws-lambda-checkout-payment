import { Controller, Get, Render, UseGuards, UseFilters } from '@nestjs/common';
import { CheckoutService } from 'src/checkout/checkout.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Unauthorized } from 'src/auth/auth.filter';

@Controller('panel')
export class PanelController {

  constructor(private readonly service: CheckoutService) {}

  @Get()
  @Render('panel/index')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(Unauthorized)
  async index() {
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
    return { items: csv.toString().replace(/,/g, '</td><td>').replace(/\n/g, "</td></tr>\n<tr><td>") };
  }

}
