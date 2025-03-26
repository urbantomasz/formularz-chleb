import { OrderItemDto } from "./order-item-dto";

export interface OrderDto {
    orderId: number;
    note: string;
    customerName: string;
    phone: number;
    createdAt: Date;
    orderDate: Date;
    items: OrderItemDto[];
  }