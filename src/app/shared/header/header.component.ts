import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { setCookie } from '../../core/cookie.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
