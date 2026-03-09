import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { Bread } from '../../models/bread';
import { Order } from '../../models/order';
import { OrderDto } from '../../models/order-dto';
import { FormatDatePipe } from "../../pipes/format-date.pipe";
import { FormatDateTimePipe } from "../../pipes/format-datetime.pipe";
import { BreadService } from '../../services/bread.service';
import { DateService } from '../../services/date.service';
import { OrderService } from '../../services/order.service';
import { OrderEditComponent } from '../order-edit/order-edit.component';
import { ConfirmDialog } from './confirm-dialog.component';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatSelectModule, MatCardModule, MatFormFieldModule,
    FormatDatePipe, MatPaginatorModule, MatIconModule,
    FormatDateTimePipe, MatTabsModule,
],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  historyOrders: OrderDto[] = [];
  allOrders: OrderDto[] = []; 
  filteredOrders: OrderDto[] = []
  dataSource = new MatTableDataSource<OrderDto>([]);
  availableDates: Date[] = [];
  selectedDate?: Date = undefined;
  displayedColumns: string[] = ['createdAt','orderDate', 'customerName', 'phone', 'breads', 'note', 'actions'];
  breadSummaryArray: { name: string; quantity: number }[] = [];
  breadTypes: Bread[] = [];   

  private orderService = inject(OrderService);
  private breadService = inject(BreadService);
  private deateService = inject(DateService);
  private dialog = inject(MatDialog);
  selectedTabIndex = 1;
  pastDates: Date[] = [];
  upcomingDates: Date[] = [];
  dates: Date[] = [];
  showHistory = false;


  onTabChange(index: number) {
    if(index === 0){
      this.showHistory = true;
      this.selectedDate = undefined;
    }
    else if (index === 1) {
       this.showHistory = false;
      this.selectedDate = undefined;
    } else {
      this.showHistory = false;
      this.selectedDate = this.availableDates[index - 2];
    }
    this.filterOrders();
  }

  extractAvailableDates() {
    this.availableDates = Array.from(
      new Set(this.allOrders.map(order => order.orderDate.getTime()))
    )
      .map(timestamp => new Date(timestamp))
      .sort((a, b) => a.getTime() - b.getTime());
  }
 
  ngOnInit() {
    forkJoin({
      historyOrders: this.orderService.getPastOrders(),
      orders: this.orderService.getOrders(),
      breads: this.breadService.getBreads(),
      dates: this.deateService.getCurrentWeekDates(),
      upcomingDates: this.deateService.getUpcomingDates(),
    }).subscribe({
      next: ({ historyOrders, orders, breads, dates, upcomingDates }) => {
        this.upcomingDates = upcomingDates;
        this.dates = dates; 
        this.historyOrders = historyOrders;
        this.allOrders = orders;
        this.breadTypes = breads;
        this.extractAvailableDates();
        this.filterOrders(); 
      },
      error: (error) => {
        console.error('Error loading data', error);
        alert('❌ Błąd ładowania danych!');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  
  }

  
  getBreadName(breadId: number): string {
    const bread = this.breadTypes.find(b => b.breadId === Number(breadId));
    return bread ? bread.shortName : 'Nieznany chleb'; 
  }


  filterOrders() {
    if(this.showHistory) {
      this.filteredOrders = [...this.historyOrders];
    }
    else if (!this.selectedDate) {
      this.filteredOrders = [...this.allOrders]; // Jeśli brak filtra, wyświetl wszystkie zamówienia
    } else {
      this.filteredOrders = this.allOrders.filter(order => order.orderDate.getDate() === this.selectedDate?.getDate());
    }
    this.dataSource.data = this.filteredOrders;
    this.updateBreadSummary();
  }

  updateBreadSummary() {
    const summaryMap: Record<number, number> = {};
  
    for (const order of this.filteredOrders) {
      for (const item of order.items) {
        summaryMap[item.breadId] = (summaryMap[item.breadId] || 0) + item.quantity;
      }
    }
  
    this.breadSummaryArray = this.breadTypes.map(b => ({
      name: b.shortName,
      quantity: summaryMap[b.breadId] || 0
    }));
  }

  
  generateExcelReport(date?: Date | null) {

    if (!date) {
      return alert('❌ Wybierz datę!');
    }

    this.orderService.getOrdersReportExcel(date).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `Raport_${this.selectedDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: () => alert('❌ Błąd generowania raportu!'),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  confirmDelete(orderId: number) {
    const confirmDialog = this.dialog.open(ConfirmDialog, {
      data: { message: "Czy na pewno chcesz usunąć zamówienie?" },
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOrder(orderId);
      }
    });
  }

  deleteOrder(orderId: number) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        // Remove the deleted order from allOrders
        this.allOrders = this.allOrders.filter(o => o.orderId !== orderId);
        
        // Reapply filtering to update filteredOrders and dataSource
        this.filterOrders();
      },
      error: () => alert('❌ Nie udało się usunąć zamówienia!'),
    });
  }
  
   uniqueSortedDates(dates: Date[]): Date[] {
  return Array.from(new Map(dates.map(d => [d.getTime(), d])).values())
    .sort((a, b) => a.getTime() - b.getTime());
}

  openEditDialog(order: Order) {

    const orderCopy = { ...order };

    const editDates = this.uniqueSortedDates([
    orderCopy.orderDate!,
    ...this.availableDates,
    ...this.upcomingDates,
  ]);

    const dialogRef = this.dialog.open(OrderEditComponent, {
      width: '600px',
      data: {
        order: orderCopy,
        breads: this.breadTypes,
        dates: editDates
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update order list after successful edit
        const index = this.allOrders.findIndex(o => o.orderId === result.orderId);
        if (index !== -1) {
          this.allOrders[index] = result;
          this.filterOrders();
        }
      }
    });
  }
}
