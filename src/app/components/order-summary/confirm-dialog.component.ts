import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <mat-dialog-content class="text-center">
      <h2>{{ data.message }}</h2>
    </mat-dialog-content>
    <mat-dialog-actions class="flex justify-center gap-4 mt-4">
    <button type="button" mat-raised-button (click)="dialogRef.close(true)">✅ Tak</button>
    <button type="button" mat-raised-button  (click)="dialogRef.close(false)">❌ Nie</button>
    
    </mat-dialog-actions>
  `,
})
export class ConfirmDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmDialog>) {}
}
