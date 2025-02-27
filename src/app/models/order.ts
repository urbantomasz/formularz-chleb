import { OrderItem } from "./order-item";

export interface Order {
    orderId?: number;
    note?: string;
    customerName: string;
    phone: string;
    orderDate?: Date;
    items: OrderItem[];
  }