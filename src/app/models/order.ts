import { OrderItem } from "./order-item";

export interface Order {
    orderId?: number;
    note?: string;
    customerName: string;
    phone?: number;
    orderDate?: Date;
    items: OrderItem[];
  }