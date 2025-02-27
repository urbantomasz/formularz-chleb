import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialog } from './confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from "../../pipes/format-date.pipe";
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatSelectModule, MatCardModule, MatFormFieldModule,
    FormatDatePipe
],
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent implements OnInit {
  orders: Order[] = [];
  selectedDate: string = '';
  displayedColumns: string[] = ['customerName', 'phone', 'orderDate', 'breads', 'note', 'actions'];
  breadSummaryArray: { name: string; quantity: number }[] = [];

  private orderService = inject(OrderService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateBreadSummary();
      },
      error: () => alert('❌ Błąd pobierania zamówień!'),
    });
  }

  loadOrdersByDate() {
    if (this.selectedDate === '') {
      this.loadOrders();
      return;
    }
    this.orderService.getOrdersByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateBreadSummary();
      },
      error: () => alert('❌ Brak zamówień na wybrany dzień!'),
    });
  }

  confirmDelete(orderId: number) {
    const confirmDialog = this.dialog.open(ConfirmDialog, {
      data: { message: "Czy na pewno chcesz usunąć zamówienie?" },
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOrder(orderId);
      }
    });
  }

  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.orderId !== orderId);
        this.calculateBreadSummary();
      },
      error: () => alert('❌ Nie udało się usunąć zamówienia!'),
    });
  }

  modifyOrder(orderId: number) {
    alert(`Edytowanie zamówienia ${orderId} - do zaimplementowania!`);
  }

  calculateBreadSummary() {
    const breadCount: { [key: string]: number } = {};
    this.orders.forEach(order => {
      order.items.forEach(bread => {
        if (!breadCount[bread.name]) {
          breadCount[bread.name] = 0;
        }
        breadCount[bread.name] += bread.quantity;
      });
    });

    this.breadSummaryArray = Object.keys(breadCount).map(name => ({
      name,
      quantity: breadCount[name]
    }));
  }
}
