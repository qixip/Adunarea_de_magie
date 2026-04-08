import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshDone$ = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getAccessToken();
    const authReq = token ? this.attach(req, token) : req;

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private attach(req: HttpRequest<any>, token: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshDone$.next(null);

      return this.auth.refreshToken().pipe(
        switchMap(res => {
          this.isRefreshing = false;
          this.refreshDone$.next(res.accessToken);
          return next.handle(this.attach(req, res.accessToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.auth.logout();
          this.router.navigate(['/auth']);
          return throwError(() => err);
        })
      );
    }

    return this.refreshDone$.pipe(
      filter((t): t is string => t !== null),
      take(1),
      switchMap(token => next.handle(this.attach(req, token)))
    );
  }
}