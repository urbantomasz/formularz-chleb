import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order } from '../models/order';
import { OrderDto } from '../models/order-dto';
import { OrderDataDto } from '../models/order-data-dto';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`; 

  http = inject(HttpClient)

  getOrders(): Observable<OrderDataDto> {
    return this.http.get<OrderDataDto>(`${this.apiUrl}`);
  }

  getOrdersReport(date: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report/${date}`);
  }

  getOrdersReportExcel(date?: Date): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/excel/${date}`, { responseType: 'blob' });
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
