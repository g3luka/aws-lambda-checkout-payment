import { Phone } from "./phone";
import { Document } from "./document";

export class Sender {
  name: string;
  surname: string;
  email: string;
  phone: Phone;
  documents: Document[]
  bornDate: string;
}
