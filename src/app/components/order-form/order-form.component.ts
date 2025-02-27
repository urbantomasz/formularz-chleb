import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { BreadService } from '../../services/bread.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { OnlyDigitsDirective } from '../directives/only-digits.directive';
import { OnlyLettersDirective } from '../directives/only-letters.directive';
import { Bread } from '../../models/bread';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, OnlyDigitsDirective, OnlyLettersDirective, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent implements OnInit {
  order: Order = {
    customerName: '',
    phone: '',
    orderDate: undefined,
    items: []
  };

  breadTypes: Bread[] = [];  
  availableBreads: Bread[] = [];
  availableDates: { label: string; value: Date }[] = [];
  showValidationErrors = true;
  isSubmitting = false;
  orderSubmitted = false;
  submissionSuccess = false;

  private orderService = inject(OrderService);
  private breadService = inject(BreadService);
  private dialog = inject(MatDialog);
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
      { label: `Wtorek (${this.formatDate(nextTuesday)})`, value: nextTuesday },
      { label: `Środa (${this.formatDate(nextWednesday)})`, value: nextWednesday },
      { label: `Czwartek (${this.formatDate(nextThursday)})`, value: nextThursday }
    ];
  
    this.order.orderDate = this.availableDates[0].value; // Default selection
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  


  getNextWeekday(currentDate: Date, targetDay: number): Date {
    const date = new Date(currentDate);
    const diff = (targetDay + 7 - date.getDay()) % 7 || 7;
    date.setDate(date.getDate() + diff);
    return date;
  }

  updateAvailableBreads() {
    // Get selected bread IDs
    const selectedBreadIds = this.order.items.map(b => b.breadId);
  
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
        this.addBreadChoice();
      },
      error: () => alert('❌ Nie udało się pobrać listy chlebów!')
    });
  }

  addBreadChoice() {
    const firstAvailable = this.availableBreads.find(b => !b.disabled);
    if (!firstAvailable) return;

    // Select the first available bread that isn't already chosen
    const newBread: OrderItem = { breadId: firstAvailable.breadId, name: firstAvailable.name, quantity: 1 };
    this.order.items.push(newBread);
    this.updateAvailableBreads();
  }


  removeBreadChoice(index: number) {
    this.order.items.splice(index, 1);
    this.updateAvailableBreads();
  }

  increaseQuantity(index: number) {
    if (this.order.items[index].quantity < 10) {
      this.order.items[index].quantity++;
    }
  }

  decreaseQuantity(index: number) {
    if (this.order.items[index].quantity > 1) {
      this.order.items[index].quantity--;
    }
  }

  openConfirmationModal() {
    if (!this.isFormValid()) {
      this.showValidationErrors = true;
      return;
    }
  }

  submitOrder() {
    this.isSubmitting = true; 
  
    this.orderService.submitOrder(this.order).subscribe({
      next: () => {
        this.submissionSuccess = true;
        this.orderSubmitted = true;
        this.isSubmitting = false;  
      },
      error: () => {
        this.submissionSuccess = false;
        this.orderSubmitted = true;
        this.isSubmitting = false; 
      }
    });
  }

  resetForm() {
    this.order = {
      customerName: '',
      phone: '',
      orderDate: this.availableDates[0].value,
      items: []
    };
    this.showValidationErrors = false;
  }

  isFormValid(): boolean {
    return this.order.customerName.trim() !== '' &&
           this.order.phone.trim().length === 9 &&
           this.order.orderDate !== undefined &&
           this.order.items.length > 0;
  }

  openConfirmationDialog() {
    if (!this.isFormValid()) {
      this.showValidationErrors = true;
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: { order: this.order }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.submitOrder();
      }
    });
  }

}
