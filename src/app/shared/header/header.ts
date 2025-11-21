import { Component, inject, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { setCookie } from '../../core/cookie.utils';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
})
export class Header {
  private authService = inject(AuthService);

  @Output() searchChange = new EventEmitter<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  logout(): void {
    this.authService.logout();
  }
}
