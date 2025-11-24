import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let authServiceMock: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockReturnValue(of({})),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Positive Test Case
  it('should navigate to products on successful login', () => {
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    expect(component.errorMessage()).toBe('');
  });

  // Negative Test Case: Invalid Form
  it('should show error message when form is invalid', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();

    expect(component.errorMessage()).toBe('Please fill in all required fields.');
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  // Negative Test Case: Login Failure
  it('should show error message on login failure', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Invalid credentials')));
    component.loginForm.setValue({ username: 'wronguser', password: 'wrongpassword' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(component.errorMessage()).toBe('Invalid username or password');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
