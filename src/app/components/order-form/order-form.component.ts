import { Component, inject, OnInit } from '@angular/core';
import { OrderService, Order, OrderItem } from '../../services/order.service';
import { BreadService, Bread } from '../../services/bread.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
  order: Order = {
    customerName: '',
    phone: '',
    orderDate: '',
    breads: []
  };
  availableDates = ['Wtorek', 'Środa', 'Czwartek'];
  breadTypes: Bread[] = [];
  showConfirmationModal = false;

  private orderService = inject(OrderService);
  private breadService = inject(BreadService);

  ngOnInit() {
    this.breadService.getBreads().subscribe({
      next: (data) => (this.breadTypes = data),
      error: () => alert('Nie udało się pobrać listy chlebów!')
    });
  }

  addBreadChoice() {
    if (this.breadTypes.length === 0) return;
    this.order.breads.push({ name: this.breadTypes[0].name, quantity: 1 });
  }

  openConfirmationModal() {
    this.showConfirmationModal = true;
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  submitOrder() {
    this.orderService.submitOrder(this.order).subscribe({
      next: () => {
        alert('Zamówienie zostało złożone!');
        this.resetForm();
      },
      error: () => {
        alert('Wystąpił błąd! Proszę spróbować ponownie.');
      }
    });

    this.closeConfirmationModal();
  }

  resetForm() {
    this.order = { customerName: '', phone: '', orderDate: '', breads: [] };
  }
}
