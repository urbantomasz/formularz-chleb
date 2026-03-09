import { Order } from "../models/order";
import { OrderRequest } from "../models/order-request";

export class OrderMapper {

  static toRequest(order: Order): OrderRequest {

    if (!order.orderDate) {
      throw new Error('OrderDate is required');
    }

    return {
      note: order.note,
      customerName: order.customerName,
      phone: order.phone!, 
      orderDate: order.orderDate.toISOString().split('T')[0],
      items: order.items
    };
  }
}