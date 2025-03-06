import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private allowedEmails = ['urbantomasz94@gmail.com', 'mojepszczolymk@gmail.com'];

  constructor(private authService: AuthService, private oauthService: OAuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
 // Ensure user is authenticated
    if (!this.authService.isLoggedIn) {
      this.authService.login(window.location.pathname); 
      return false;
    }

  // Get user profile from OAuth service
    const claims = this.oauthService.getIdentityClaims();
    const userEmail = claims ? (claims as any).email : null;

    // Check if user is in the allowed list
    if (!userEmail || !this.allowedEmails.includes(userEmail)) {
      this.router.navigate(['/chleb/formularz']); 
      return false;
    }

    return true;
  }
}
