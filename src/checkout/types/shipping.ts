import { Address } from "./address";

export class Shipping {
  type: boolean;
  address: Address;
  cost: number;
  addressRequired: boolean;
}
