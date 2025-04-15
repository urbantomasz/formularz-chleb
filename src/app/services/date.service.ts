import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { Bread } from '../models/bread';

@Injectable({
  providedIn: 'root'
})
export class DateService {
    private apiUrl = `${environment.apiUrl}/dates`;

  constructor(private http: HttpClient) {}

  // ✅ Pobiera listę dostępnych chlebów
  getUpcomingDates(): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}`).pipe(
          map(response => 
            response.map(dateStr => {

              console.log('przed: ', dateStr); 
              console.log('po: ', new Date(dateStr));
              return new Date(dateStr)
            }) // ✅ Convert strings to Date objects
          )
        );
  }

  getPastDates(): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/past`).pipe(
          map(response => 
            response.map(dateStr => {
              return new Date(dateStr)
            }) // ✅ Convert strings to Date objects
          )
        );
  }

  getCurrentWeekDates(): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/current`).pipe(
          map(response => 
            response.map(dateStr => {
              return new Date(dateStr)
            }) // ✅ Convert strings to Date objects
          )
        );
  }

  getDistinctDates(): Observable<Date[]> {
    return this.http.get<string[]>(`${this.apiUrl}/current`).pipe(
      map(currentDates => currentDates.concat([])), // Pobierz current dates
      switchMap(currentDates =>
        this.http.get<string[]>(`${this.apiUrl}`).pipe(
          map(upcomingDates => {
            const combinedDates = [...currentDates, ...upcomingDates];
            const uniqueDates = combinedDates.filter(
              (date, index, self) => self.indexOf(date) === index
            );
            return uniqueDates.map(dateStr => new Date(dateStr));
          })
        )
      )
    );
  }


}
