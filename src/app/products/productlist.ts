import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [],
  templateUrl: './productlist.html',
})
export class Productlist {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
