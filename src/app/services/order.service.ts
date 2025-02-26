import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  orderId?: number;
  note?: string;
  customerName: string;
  phone: string;
  orderDate: string;
  breads: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/breads`; 

  http = inject(HttpClient)

  getOrdersByDate(date: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/report/${date}`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}`);
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
