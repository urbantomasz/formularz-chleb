import { Component, inject } from '@angular/core';
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
export class ConfirmationDialogComponent {
  public dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { order: Order; breads: Bread[] };

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  getBreadName(breadId: number): string {
    const bread = this.data.breads.find(b => b.breadId === Number(breadId));
    return bread ? bread.name : 'Nieznany chleb'; 
  }
}
