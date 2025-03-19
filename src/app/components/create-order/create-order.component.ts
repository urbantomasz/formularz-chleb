import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [OrderFormComponent ,CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {

  order: Order = {
    customerName: '',
    phone: undefined,
    orderDate: undefined,
    items: []
  };

  @ViewChild(OrderFormComponent) orderForm!: OrderFormComponent; 
  
  breadTypes: Bread[] = [];  
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

  resetForm() {
    this.orderSubmitted = false;
    this.submissionSuccess = false;
    this.orderForm.resetForm();
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

  loadBreads() {
    this.breadService.getBreads().subscribe({
      next: (data) => {
        this.breadTypes = data;
      },
      error: () => alert('❌ Nie udało się pobrać listy chlebów!')
    });
  }

  isFormValid() {
    return this.orderForm?.isFormValid();
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
