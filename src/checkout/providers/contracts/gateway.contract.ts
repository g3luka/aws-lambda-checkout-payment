import { CheckoutRequest } from "src/checkout/types/requests/checkout.request";

export interface GatewayProvider {
  create(checkout: CheckoutRequest);
  notification(request: any);
  fromRequest(request: CheckoutRequest);
}
