import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../../models/order';
import { Bread } from '../../models/bread';
import { OrderFormComponent } from '../order-form/order-form.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, OrderFormComponent],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css'
})
export class OrderEditComponent implements OnInit {
  @ViewChild(OrderFormComponent) orderForm!: OrderFormComponent;
  order: Order;
  availableBreads: Bread[] = [];
  availableDates: { label: string; value: Date }[] = [];

  constructor(
    private dialogRef: MatDialogRef<OrderEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order, breads: Bread[], dates: { label: string; value: Date }[] },
    private orderService: OrderService
  ) {
    this.order = { ...data.order }; // Clone to avoid modifying the original before saving
    this.availableBreads = data.breads;
    this.availableDates = data.dates;
  }

  ngOnInit() {
    console.log("Editing order:", this.order);
  }

  saveChanges() {
    if (!this.orderForm.isFormValid()) return;

    this.orderService.updateOrder(this.order.orderId as number, this.order).subscribe({
      next: () => {
        this.dialogRef.close(this.order);
      },
      error: () => alert("❌ Error updating order"),
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
