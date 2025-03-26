import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from '../../models/order';
import { Bread } from '../../models/bread';
import { OrderFormComponent } from '../order-form/order-form.component';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, OrderFormComponent],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css'
})
export class OrderEditComponent  {
  @ViewChild(OrderFormComponent) orderForm!: OrderFormComponent;
  order: Order;
  breadTypes: Bread[] = [];
  availableDates: Date[] = [];

  constructor(
    private dialogRef: MatDialogRef<OrderEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order, breads: Bread[], dates: Date[] },
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    this.order = data.order;
    this.breadTypes = data.breads;
    this.availableDates = data.dates;
  }

  saveChanges() {
    if (!this.orderForm?.isFormValid()) return;

    this.orderService.updateOrder(this.order.orderId as number, this.order).subscribe({
      next: () => {
        this.snackBar.open('✅ Zamówienie zostało zmienione!', 'Zamknij', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.dialogRef.close(this.order);
      },
      error: (err) => {
         this.snackBar.open('❌ Błąd podczas zapisu!', 'Zamknij', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      console.error(err);
      },
    });
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
