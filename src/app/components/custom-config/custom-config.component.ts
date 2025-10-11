// custom-dates-admin.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CustomConfigDto, UpdateCustomConfigRequest } from '../../models/custom-config-dto';
import { CustomConfigService } from '../../services/custom-config.service';
import { MatHint, MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule,  } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-custom-config',
  templateUrl: './custom-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,                           
    MatSlideToggleModule,                 
    MatFormFieldModule,                     
    MatInputModule,                         
    MatDatepickerModule,                   
    MatNativeDateModule,                    
    MatButtonModule,                        
    MatIconModule,
    DatePipe   
  ]
})
export class CustomConfigComponent implements OnInit {
  saving = false;

  datesEnabled = false;
  bannerEnabled = false;
  bannerMessage = '';

  dateToAdd: Date | null = null;
  items: Date[] = []; // trzymamy Date (UTC midnight)

  constructor(private cfgSvc: CustomConfigService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.cfgSvc.get().subscribe((d: CustomConfigDto) => {
      this.datesEnabled  = d.datesEnabled;
      this.bannerEnabled = d.bannerEnabled;
      this.bannerMessage = d.bannerMessage ?? '';
      this.items = (d.datesUtc || []).map(x => new Date(x))
        .sort((a,b)=>a.getTime()-b.getTime());
    });
  }

  addDate() {
    if (!this.dateToAdd) return;
    const d = this.toUtcMidnight(this.dateToAdd);
    if (!this.items.some(x => x.getTime() === d.getTime())) {
      this.items = [...this.items, d].sort((a,b)=>a.getTime()-b.getTime());
    }
    this.dateToAdd = null;
  }

  removeDate(i: number) {
    this.items.splice(i, 1);
    this.items = [...this.items];
  }

  save() {
    // Walidacje UX
    if (this.datesEnabled && this.items.length === 0) {
      alert('Włączone niestandardowe daty wymagają co najmniej jednej daty.');
      return;
    }
    if (this.bannerEnabled && (this.bannerMessage ?? '').trim().length === 0) {
      alert('Włączony baner wymaga treści.');
      return;
    }
    if ((this.bannerMessage ?? '').length > 300) {
      alert('Wiadomość jest za długa (max 300 znaków).');
      return;
    }

    const payload: UpdateCustomConfigRequest = {
      datesEnabled: this.datesEnabled,
      bannerEnabled: this.bannerEnabled,
      bannerMessage: this.bannerMessage?.trim() || null,
      datesUtc: this.items.map(d => d.toISOString())
    };

    this.saving = true;
    this.cfgSvc.update(payload).subscribe({
      next: () => { this.saving = false; /* tu toast „Zapisano” */ },
      error: () => { this.saving = false; /* tu toast błędu */ }
    });
  }

  private toUtcMidnight(localDate: Date): Date {
    // 00:00 UTC tego dnia — zgodne z backendem
    return new Date(Date.UTC(
      localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0
    ));
  }
}
