import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenProvider {
  private token: string | null = localStorage.getItem('access_token'); 

  public getToken(): string | null {
    return this.token || localStorage.getItem('access_token'); 
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token); 
    } else {
      localStorage.removeItem('access_token');
    }
  }
}
