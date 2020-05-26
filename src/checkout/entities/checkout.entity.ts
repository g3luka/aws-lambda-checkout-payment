import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { CheckoutRequest } from "../types/requests/checkout.request";
import { Item } from "../types/item";

@Entity({ name: 'checkout_donations' })
export class Checkout {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_name', length: 255 })
  customerName: string;

  @Column({ name: 'customer_surname', length: 255 })
  customerSurname: string;

  @Column({ name: 'customer_email', length: 100 })
  customerEmail: string;

  @Column({ name: 'customer_cpf', length: 15 })
  customerCpf: string;

  @Column({ type: 'double' })
  amount: number;

  @Column({ type: 'enum', enum: ['unique', 'recurrent'], default: 'unique' })
  recurrence?: string;

  @Column({ type: 'enum', enum: ['waiting', 'payed', 'canceled'], default: 'waiting' })
  status?: string;

  @Column({ length: 20 })
  gateway: string;

  @Column({ name: 'transaction_id', length: 50, unique: true, nullable: true, default: null })
  transactionId?: string;

  @Column({ name: 'gateway_status', length: 30, nullable: true, default: null })
  gatewayStatus?: string;

  @Column({ name: 'gateway_metadata', type: 'text', nullable: true, default: null })
  gatewayMetadata?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  fromRequest(checkout: CheckoutRequest) {

    if (checkout.sender != null) {
      this.customerName = checkout.sender?.name || null;
      this.customerSurname = checkout.sender?.surname || null;
      this.customerCpf = checkout.sender?.documents[0]['value'] || null;
      this.customerEmail = checkout.sender?.email || null;
    }

    if (checkout.items.length) {
      this.amount = 0;
      checkout.items.forEach((item: Item) => {
        this.amount += item.amount * item.quantity;
      });
    }
    this.amount += checkout.extraAmount || 0;

    this.gateway = checkout.gateway;

    return this;
  }

}
