import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order, OrderItem } from '../../services/order.service';
import { BreadService, Bread } from '../../services/bread.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './order-form.component.html'
})
export class OrderFormComponent implements OnInit {
  order: Order = {
    customerName: '',
    phone: '',
    orderDate: '',
    breads: []
  };

  breadTypes: Bread[] = [];  
  availableBreads: Bread[] = [];
  availableDates: string[] = [];
  showConfirmationModal = false;
  showValidationErrors = false;

  private orderService = inject(OrderService);
  private breadService = inject(BreadService);
  private router = inject(Router);

  ngOnInit() {
    //this.redirectIfNotMonday();
    this.setAvailableDates();
    this.loadBreads();
  }

  redirectIfNotMonday() {
    const today = new Date();
    if (today.getDay() !== 1) {
      this.router.navigate(['/summary']);
    }
  }

  setAvailableDates() {
    const today = new Date();
    const nextTuesday = this.getNextWeekday(today, 2);
    const nextWednesday = this.getNextWeekday(today, 3);
    const nextThursday = this.getNextWeekday(today, 4);

    this.availableDates = [
      nextTuesday.toLocaleDateString('pl-PL'),
      nextWednesday.toLocaleDateString('pl-PL'),
      nextThursday.toLocaleDateString('pl-PL')
    ];

    this.order.orderDate = this.availableDates[0]; // Domyślnie pierwszy dostępny dzień
  }

  getNextWeekday(currentDate: Date, targetDay: number): Date {
    const date = new Date(currentDate);
    const diff = (targetDay + 7 - date.getDay()) % 7 || 7;
    date.setDate(date.getDate() + diff);
    return date;
  }

  updateAvailableBreads() {
    // Get selected bread IDs
    const selectedBreadIds = this.order.breads.map(b => b.breadId);
  
    // Update availableBreads but DO NOT REMOVE items, just mark them as disabled
    this.availableBreads = this.breadTypes.map(bread => ({
      ...bread,
      disabled: selectedBreadIds.includes(bread.breadId) // ✅ Mark as disabled
    }));
  }
  
  onBreadSelectionChange(index: number, newBreadId: number) {
    // ✅ Refresh disabled items
    this.updateAvailableBreads();
  }
  


  loadBreads() {
    this.breadService.getBreads().subscribe({
      next: (data) => {
        this.breadTypes = data;
        this.updateAvailableBreads();
      },
      error: () => alert('❌ Nie udało się pobrać listy chlebów!')
    });
  }

  addBreadChoice() {
    const firstAvailable = this.availableBreads.find(b => !b.disabled);
    if (!firstAvailable) return;

    // Select the first available bread that isn't already chosen
    const newBread: OrderItem = { breadId: firstAvailable.breadId, name: firstAvailable.name, quantity: 1 };
    this.order.breads.push(newBread);
    this.updateAvailableBreads();
  }


  removeBreadChoice(index: number) {
    this.order.breads.splice(index, 1);
    this.updateAvailableBreads();
  }

  increaseQuantity(index: number) {
    if (this.order.breads[index].quantity < 10) {
      this.order.breads[index].quantity++;
    }
  }

  decreaseQuantity(index: number) {
    if (this.order.breads[index].quantity > 1) {
      this.order.breads[index].quantity--;
    }
  }

  openConfirmationModal() {
    if (!this.isFormValid()) {
      this.showValidationErrors = true;
      return;
    }
    this.showConfirmationModal = true;
  }

  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  submitOrder() {
    this.orderService.submitOrder(this.order).subscribe({
      next: () => {
        alert('✅ Zamówienie zostało złożone!');
        this.resetForm();
      },
      error: () => {
        alert('❌ Wystąpił błąd! Proszę spróbować ponownie.');
      }
    });

    this.closeConfirmationModal();
  }

  resetForm() {
    this.order = {
      customerName: '',
      phone: '',
      orderDate: this.availableDates[0],
      breads: []
    };
    this.showValidationErrors = false;
  }

  isFormValid(): boolean {
    return this.order.customerName.trim() !== '' &&
           this.order.phone.trim() !== '' &&
           this.order.orderDate !== '' &&
           this.order.breads.length > 0;
  }
}
