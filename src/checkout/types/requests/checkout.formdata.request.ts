import { CheckoutRequest } from "./checkout.request";
import { Item } from "../item";

export class CheckoutFormDataRequest {

  currency: string;
  reference: string;

  senderName: string;
  senderAreaCode: number;
  senderPhone: number;
  senderCPF: string;
  senderBornDate: string;
  senderEmail: string;

  shippingType: boolean;
  shippingCost: number;
  shippingAddressStreet: string;
  shippingAddressNumber: number;
  shippingAddressComplement: string;
  shippingAddressDistrict: string;
  shippingAddressPostalCode: number;
  shippingAddressCity: string;
  shippingAddressState: string;
  shippingAddressCountry: string;

  extraAmount: number;
  redirectURL: string;
  notificationURL: string;
  maxUses: number;
  maxAge: number;

  fromCheckout(checkout: CheckoutRequest) {
    this.currency = checkout.currency || null;
    this.reference = checkout.reference || null;

    if (checkout.items.length) {
      checkout.items.forEach((item: Item, index: number) => {
        index++;
        this[`itemId${index}`] = item.id || index;
        this[`itemDescription${index}`] = item.description;
        this[`itemAmount${index}`] = item.amount.toFixed(2);
        this[`itemQuantity${index}`] = item.quantity || 1;
        if (item.weight) {
          this[`itemWeight${index}`] = item.weight;
        }
      });
    }

    if (checkout.sender != null) {
      this.senderName = `${checkout.sender?.name} ${checkout.sender?.surname}` || null;
      this.senderAreaCode = checkout.sender?.phone?.areaCode || null;
      this.senderPhone = checkout.sender?.phone?.number || null;
      this.senderCPF = checkout.sender?.documents[0]['value'].replace(/[\D]/g, '') || null;
      this.senderBornDate = checkout.sender?.bornDate || null;
      this.senderEmail = checkout.sender?.email || null;
      this.shippingType = checkout.shipping?.type || null;
      this.shippingCost = checkout.shipping?.cost || null;
    }

    if (checkout.shipping != null && checkout.shipping.address != null) {
      this.shippingAddressStreet = checkout.shipping?.address?.street || null;
      this.shippingAddressNumber = checkout.shipping?.address?.number || null;
      this.shippingAddressComplement = checkout.shipping?.address?.complement || null;
      this.shippingAddressDistrict = checkout.shipping?.address?.district || null;
      this.shippingAddressPostalCode = checkout.shipping?.address?.postalCode || null;
      this.shippingAddressCity = checkout.shipping?.address?.city || null;
      this.shippingAddressState = checkout.shipping?.address?.state || null;
      this.shippingAddressCountry = checkout.shipping?.address?.country || null;
    }

    this.extraAmount = checkout.extraAmount || null;
    this.redirectURL = checkout.redirectURL || null;
    this.notificationURL = checkout.notificationURL || null;
    this.maxUses = checkout.maxUses || null;
    this.maxAge = checkout.maxAge || null;

    return this;
  }

}
