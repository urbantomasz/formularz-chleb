import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order } from '../models/order';
import { OrderDto } from '../models/order-dto';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`; 

  http = inject(HttpClient)

  getOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}`).pipe(
      map((orders) =>
      orders.map((order) => ({
        ...order,
        orderDate: new Date(order.orderDate),
      }))
      )
    );
  }

  getPastOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/history`).pipe(
      map((orders) =>
      orders.map((order) => ({
        ...order,
        orderDate: new Date(order.orderDate),
      }))
      )
    );
  }
  
  getOrdersReportExcel(date: Date): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/excel/${date.toDateString()}`, { responseType: 'blob' });
  }
  
  submitOrder(order: Order): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, OrderMapper.toRequest(order));
  }

  updateOrder(orderId: number, order: Order): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${orderId}`, OrderMapper.toRequest(order));
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }
}
