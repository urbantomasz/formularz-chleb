import { Component, OnInit, inject } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent implements OnInit {
  orders: Order[] = [];
  selectedDate: string = '';
  breadSummary: { [key: string]: number } = {};

  private orderService = inject(OrderService);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateBreadSummary();
      },
      error: () => alert('Nie udało się pobrać zamówień!')
    });
  }

  loadOrdersByDate() {
    if (!this.selectedDate) return;
    this.orderService.getOrdersByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateBreadSummary();
      },
      error: () => alert('Nie udało się pobrać zamówień!')
    });
  }

  deleteOrder(orderId: number) {
    if (!confirm('Na pewno chcesz usunąć to zamówienie?')) return;
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.orderId !== orderId);
        this.calculateBreadSummary();
      },
      error: () => alert('Nie udało się usunąć zamówienia!')
    });
  }

  calculateBreadSummary() {
    this.breadSummary = {};
    this.orders.forEach(order => {
      order.breads.forEach(item => {
        this.breadSummary[item.name] = (this.breadSummary[item.name] || 0) + item.quantity;
      });
    });
  }
}
