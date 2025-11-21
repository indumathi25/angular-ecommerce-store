import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUserSignal = signal<any | null>(null);

  login(username: string, password: string) {
    return this.http
      .post(
        'https://dummyjson.com/auth/login',
        { username, password, expiresInMins: 30 },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        tap((user: any) => {
          this.currentUserSignal.set(user);
        })
      );
  }
}
