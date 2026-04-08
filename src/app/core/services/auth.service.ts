import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_KEY  = 'adm_access';
  private readonly REFRESH_KEY = 'adm_refresh';

  private currentUser$ = new BehaviorSubject<AuthUser | null>(this.restoreUser());
  readonly user$ = this.currentUser$.asObservable();

  constructor(private http: HttpClient) {}

  // ── Auth state ─────────────────────────────────────────
  get isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  get currentUser(): AuthUser | null {
    return this.currentUser$.getValue();
  }

  // ── Token management ───────────────────────────────────
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  private storeTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  private restoreUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('adm_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ── API calls ──────────────────────────────────────────
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', { email, password }).pipe(
      tap(res => {
        this.storeTokens(res.accessToken, res.refreshToken);
        localStorage.setItem('adm_user', JSON.stringify(res.user));
        this.currentUser$.next(res.user);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http.post<void>('/api/auth/register', { name, email, password });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/refresh', {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(res => this.storeTokens(res.accessToken, res.refreshToken))
    );
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem('adm_user');
    this.currentUser$.next(null);
  }
}