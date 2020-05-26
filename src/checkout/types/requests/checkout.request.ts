import { Sender } from "../sender";
import { Shipping } from "../shipping";
import { Item } from "../item";

export class CheckoutRequest {

  items: Item[];
  sender: Sender
  shipping: Shipping;

  gateway: string;
  currency: string;
  reference: string;
  extraAmount: number;
  redirectURL: string;
  notificationURL: string;
  maxUses: number;
  maxAge: number;

}
