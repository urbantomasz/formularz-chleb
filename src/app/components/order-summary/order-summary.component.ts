import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ConfirmDialog } from './confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from "../../pipes/format-date.pipe";
import { OrderDto } from '../../models/order-dto';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../models/order';
import { OrderEditComponent } from '../order-edit/order-edit.component';
import { BreadService } from '../../services/bread.service';
import { Bread } from '../../models/bread';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatButtonModule, MatSelectModule, MatCardModule, MatFormFieldModule,
    FormatDatePipe, MatPaginatorModule, MatIconModule
],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit, AfterViewInit  {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  allOrders: OrderDto[] = []; 
  filteredOrders: OrderDto[] = []
  dataSource = new MatTableDataSource<OrderDto>([]);
  availableDates: Date[] = [];
  selectedDate?: Date = undefined;
  displayedColumns: string[] = ['orderDate', 'customerName', 'phone', 'breads', 'note', 'actions'];
  breadSummaryArray: { name: string; quantity: number }[] = [];
  breadTypes: Bread[] = [];   

  private orderService = inject(OrderService);
  private breadService = inject(BreadService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadOrders();
    this.breadService.getBreads().subscribe({
      next: (data) =>{
      this.breadTypes = data;
    }})
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;  
  }

  
  getBreadName(breadId: number): string {
    const bread = this.breadTypes.find(b => b.breadId === breadId);
    return bread ? bread.shortName : 'Nieznany chleb'; 
  }


  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        console.log('orders: ', data);
        this.allOrders = data.orders;
        this.availableDates = data.dates;
        this.filterOrders();
      },
      error: () => alert('❌ Błąd pobierania zamówień!'),
    });
  }

  filterOrders() {
    if (!this.selectedDate) {
      this.filteredOrders = [...this.allOrders]; // Jeśli brak filtra, wyświetl wszystkie zamówienia
    } else {
      this.filteredOrders = this.allOrders.filter(order => order.orderDate === this.selectedDate);
    }
    this.dataSource.data = this.filteredOrders;
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
  

  openEditDialog(order: Order) {

    let orderCopy = {...order};

    const dialogRef = this.dialog.open(OrderEditComponent, {
      width: '600px',
      data: {
        order: orderCopy,
        breads: this.breadTypes,
        dates: this.availableDates
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update order list after successful edit
        const index = this.allOrders.findIndex(o => o.orderId === result.orderId);
        if (index !== -1) {
          this.allOrders[index] = result;
          this.dataSource.data = [...this.allOrders]; // Refresh the table
        }
      }
    });
  }
}
