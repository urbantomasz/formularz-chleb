import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Bread } from '../models/bread';

@Injectable({
  providedIn: 'root'
})
export class BreadService {
  private apiUrl = `${environment.apiUrl}/breads`;
  http = inject(HttpClient)

  getBreads(): Observable<Bread[]> {
    return this.http.get<Bread[]>(`${this.apiUrl}`);
  }
}