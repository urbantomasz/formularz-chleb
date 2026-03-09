import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DateService {
    private apiUrl = `${environment.apiUrl}/dates`;
    private http = inject(HttpClient)

  getUpcomingDates(): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}`).pipe(
          map(response => response.map(dateStr => new Date(dateStr))) 
        );
  }

  getCurrentWeekDates(): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/current`).pipe(
          map(response => response.map(dateStr => new Date(dateStr))) 
        );
  }
}