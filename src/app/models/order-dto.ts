import { OrderItemDto } from "./order-item-dto";

export interface OrderDto {
    orderId: number;
    note: string;
    customerName: string;
    phone: number;
    orderDate: Date;
    items: OrderItemDto[];
  }