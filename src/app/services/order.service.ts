import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order } from '../models/order';
import { OrderDto } from '../models/order-dto';



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

  getOrdersByDate(date: Date): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/date/${date.toDateString()}`).pipe(
      map((orders) =>
        orders.map((order) => ({
          ...order,
          orderDate: new Date(order.orderDate),
        }))
      )
    );
  }
  
  getOrdersReport(date: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report/${date.toDateString()}`);
  }

  getOrdersReportExcel(date: Date): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/excel/${date.toISOString()}`, { responseType: 'blob' });
  }
  
  submitOrder(order: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}`, order);
  }

  updateOrder(orderId: number, order: Order): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}`, order);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }
}
