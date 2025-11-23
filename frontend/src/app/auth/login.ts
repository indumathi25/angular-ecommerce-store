import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

/**
 * Login Component
 * Handles user authentication by capturing username and password.
 * Uses AuthService to perform the login operation.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  errorMessage = signal<string>('');

  /**
   * Form group for login credentials.
   * Contains 'username' and 'password' fields with required validation.
   */
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  /**
   * Handles the form submission.
   * Validates the form, calls AuthService.login, and navigates to products on success.
   * Displays an error message on failure.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.errorMessage.set('');

    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: () => {
        this.errorMessage.set('Invalid username or password');
      },
    });
  }
}
