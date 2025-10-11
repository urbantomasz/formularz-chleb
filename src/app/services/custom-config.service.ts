// services/custom-config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomConfigDto, UpdateCustomConfigRequest } from '../models/custom-config-dto';

@Injectable({ providedIn: 'root' })
export class CustomConfigService {
  private base = '/api/custom-dates';

  constructor(private http: HttpClient) {}

  get(): Observable<CustomConfigDto> {
    return this.http.get<CustomConfigDto>(this.base);
  }

  update(payload: UpdateCustomConfigRequest): Observable<void> {
    return this.http.put<void>(this.base, payload);
  }
}
