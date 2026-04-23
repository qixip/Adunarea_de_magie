import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly REFRESH_KEY = 'adm_refresh';
  private readonly USER_KEY    = 'adm_user';

  // Access token lives only in memory - never written to storage.
  // Ideal solution is httpOnly cookies set by the server; this is the
  // best mitigation available on the client side.
  private accessToken: string | null = null;

  private currentUser$ = new BehaviorSubject<AuthUser | null>(this.restoreUser());
  readonly user$ = this.currentUser$.asObservable();

  constructor(private http: HttpClient) {}

  // ── Auth state ──────────────────────────────────────────────────────
  get isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired(this.accessToken);
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get currentUser(): AuthUser | null {
    return this.currentUser$.getValue();
  }

  // ── Token management ────────────────────────────────────────────────
  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const raw     = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded  = raw + '=='.slice(0, (4 - raw.length % 4) % 4);
      const payload = JSON.parse(atob(padded));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  private storeTokens(access: string, refresh: string): void {
    this.accessToken = access;
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  private restoreUser(): AuthUser | null {
    // Guard against stale adm_user with no valid refresh token.
    if (!localStorage.getItem(this.REFRESH_KEY)) return null;
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ── APP_INITIALIZER hook ────────────────────────────────────────────
  // On cold page load, the in-memory access token is gone. If a refresh
  // token exists, silently renew before the router evaluates guards.
  initialize(): Promise<void> {
    if (!this.getRefreshToken()) return Promise.resolve();
    return lastValueFrom(this.refreshToken())
      .then(() => {})
      .catch(() => { this.logout(); });
  }

  // ── API calls ───────────────────────────────────────────────────────
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/login`, { email, password }).pipe(
      tap(res => {
        this.storeTokens(res.accessToken, res.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUser$.next(res.user);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/auth/register`, { name, email, password });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/api/auth/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(res => this.storeTokens(res.accessToken, res.refreshToken))
    );
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser$.next(null);
  }
}
