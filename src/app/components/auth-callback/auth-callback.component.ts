import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Trwa logowanie...</p>',
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.completeLogin();
  }
}
