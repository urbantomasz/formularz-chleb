import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomConfigComponent } from '../custom-config/custom-config.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
   standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    OrderSummaryComponent,
    CustomConfigComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersManagementComponent {
  /** 0 = Zamówienia, 1 = Konfiguracja */
  @Input() selectedIndex = 0;

  onTabChange(idx: number) {
    this.selectedIndex = idx;
  }
}