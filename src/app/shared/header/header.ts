import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

/**
 * Header Component
 * Displays the application header, including the search bar and logout button.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
})
export class Header {
  private authService = inject(AuthService);

  /**
   * Controls the visibility of the search bar.
   * Defaults to true.
   */
  @Input() showSearch = true;

  /**
   * The initial value for the search input.
   */
  @Input() initialSearch = '';

  /**
   * Event emitted when the user types in the search bar.
   * Payload is the current search string.
   */
  @Output() searchChange = new EventEmitter<string>();

  /**
   * Handles input events on the search field.
   * Emits the searchChange event with the input value.
   * @param event The DOM input event.
   */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  /**
   * Triggers the logout process via AuthService.
   */
  logout(): void {
    this.authService.logout();
  }
}
