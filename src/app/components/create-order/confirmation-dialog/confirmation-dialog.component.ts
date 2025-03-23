import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../models/order';
import { Bread } from '../../../models/bread';
import { FormatDatePipe } from "../../../pipes/format-date.pipe";

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormatDatePipe],
  templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order, breads: Bread[] }
  ) {}
  ngOnInit(): void {
    console.log("confirmation dialog data: ", this.data);
  }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getBreadName(breadId: number): string {
    const bread = this.data.breads.find(b => b.breadId === breadId);
    return bread ? bread.name : 'Nieznany chleb'; 
  }
}
