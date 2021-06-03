import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  adminIsAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.adminIsAuthenticated = isAuthenticated;
      });
    this.adminIsAuthenticated = this.authService.getIsAuth();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }
}
