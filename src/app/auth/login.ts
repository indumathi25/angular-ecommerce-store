import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { isPlatformBrowser } from '@angular/common';

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
  private platformId = inject(PLATFORM_ID);

  errorMessage = signal<string>('');

  constructor() {
    if (isPlatformBrowser(this.platformId) && this.authService.isAuthenticated()) {
      this.router.navigate(['/products']);
    }
  }

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

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
