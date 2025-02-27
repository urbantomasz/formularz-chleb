import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order } from '../models/order';
import { OrderDto } from '../models/order-dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`; 

  http = inject(HttpClient)

  getOrdersByDate(date: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/report/${date}`);
  }

  getOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}`);
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
