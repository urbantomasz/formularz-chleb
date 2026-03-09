import { OrderItem } from './order-item';

export interface OrderRequest {
  note?: string;
  customerName: string;
  phone: number;
  orderDate: string; 
  items: OrderItem[];
}
