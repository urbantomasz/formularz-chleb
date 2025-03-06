import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../configs/auth.config';
import { TokenProvider } from './token-provider.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private oauthService: OAuthService, private tokenProvider: TokenProvider) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
        const token = this.oauthService.getIdToken();
        if (token) {
          this.tokenProvider.setToken(token); // ✅ Store token in TokenProvider
        }
      });
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  async login(returnUrl: string) {
    localStorage.setItem('returnUrl', returnUrl); // Zapisanie docelowego URL
    this.oauthService.initImplicitFlow(); // Uruchomienie logowania
  }

  logout() {
    this.oauthService.logOut();
    this.tokenProvider.setToken(null); // ✅ Clear token on logou
  }

  getAccessToken(): string | null {
    return this.tokenProvider.getToken(); // ✅ Get token from TokenProvider
  }

  completeLogin() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {

      const token = this.oauthService.getIdToken();

      if (token) {
        this.tokenProvider.setToken(token);
      }
  
      const returnUrl = localStorage.getItem('returnUrl') || '/';
      localStorage.removeItem('returnUrl');
      window.location.href = returnUrl;
    });
  }
  
}
