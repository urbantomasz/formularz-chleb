import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Bread } from '../../models/bread';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { FormatDatePipe } from "../../pipes/format-date.pipe";

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule, FormatDatePipe],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnInit{
  ngOnInit(): void {
    this.loadBreads();
  }
  @Input() order!: Order;
  @Input() breadTypes: Bread[] = [];  
  @Input() availableDates: Date[] = [];
  availableBreads: Bread[] = [];
  showValidationErrors = true;

  updateAvailableBreads() {
    // Get selected bread IDs, excluding the current item being edited
    const selectedBreadIds = this.order.items.map(b => Number(b.breadId));

    // Update availableBreads but DO NOT REMOVE items, just mark them as disabled
    this.availableBreads = this.breadTypes.map(bread => ({
      ...bread,
      disabled: selectedBreadIds.includes(bread.breadId)
    }));
  }

  trackById(index: number, obj: any): any {
    return index;
  }

  isDateSelected(date: Date): boolean {
    if (!this.order.orderDate || !date) return false;    
    return this.order.orderDate.toDateString() === date.toDateString();
  }


  loadBreads() {
    this.updateAvailableBreads();
    if(this.order.items.length === 0){
      this.addBreadChoice();
    }
    console.log(this.order);
    console.log(this.breadTypes);
    console.log(this.availableDates);
  }

  addBreadChoice() {
    const firstAvailable = this.availableBreads.find(b => !b.disabled);
    if (!firstAvailable) return;

    // Select the first available bread that isn't already chosen
    const newBread: OrderItem = { 
      breadId: firstAvailable.breadId, 
      quantity: 1 
    };
    
    // Dodaj nowy chleb do listy
    this.order.items = [...this.order.items, newBread];
    this.updateAvailableBreads();
    console.log(this.order);
    console.log(this.breadTypes);
    console.log(this.availableDates);
  }

  removeBreadChoice(index: number) {
    // Usuń chleb z listy używając spread operatora
    this.order.items = this.order.items.filter((_, i) => i !== index);
    this.updateAvailableBreads();
  }

  increaseQuantity(index: number) {
    if (this.order.items[index].quantity < 30) {
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

  resetForm() {
    this.order = {
      customerName: '',
      phone: undefined,
      orderDate: this.availableDates[0],
      note: undefined,
      items: []
    };
    this.showValidationErrors = false;
  }

  isFormValid(): boolean {
    return this.order.customerName.trim() !== '' &&
           this.order.phone?.toString().length === 9 &&
           this.order.orderDate !== undefined &&
           this.order.items.length > 0;
  }
}
