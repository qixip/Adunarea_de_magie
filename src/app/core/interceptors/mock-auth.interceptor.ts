import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface MockUser { id: string; name: string; email: string; password: string; role: string; }

const DEV_ACCOUNT: MockUser = {
  id: 'dev-test-00000001',
  name: 'Test User',
  email: 'test@dev.local',
  password: 'devtest1234',
  role: 'member',
};

const DEV_ADMIN: MockUser = {
  id: 'dev-admin-00000001',
  name: 'Admin Dev',
  email: 'admin@dev.local',
  password: 'admindev1234',
  role: 'admin',
};

@Injectable()
export class MockAuthInterceptor implements HttpInterceptor {
  private readonly STORE = 'mock_users';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (environment.production) return next.handle(req);

    if (req.url.includes('/api/auth/register')     && req.method === 'POST') return this.register(req);
    if (req.url.includes('/api/auth/login')         && req.method === 'POST') return this.login(req);
    if (req.url.includes('/api/auth/refresh')       && req.method === 'POST') return this.refresh(req);
    if (req.url.includes('/api/user/subscription')  && req.method === 'GET')  return this.ok({ subscription: null });
    if (req.url.includes('/api/user/xp')            && req.method === 'GET')  return this.userXp();
    if (req.url.includes('/api/events/today')       && req.method === 'GET')  return this.eventsToday();
    if (req.url.includes('/api/events/register')    && req.method === 'POST') return this.registerEvent(req);
    if (req.url.includes('/api/admin/check-user')   && req.method === 'POST') return this.checkUser(req);
    if (req.url.includes('/api/admin/create-event') && req.method === 'POST') return this.createEvent(req);

    return next.handle(req);
  }

  private users(): MockUser[] {
    try { return JSON.parse(localStorage.getItem(this.STORE) || '[]'); } catch { return []; }
  }

  private save(users: MockUser[]): void {
    localStorage.setItem(this.STORE, JSON.stringify(users));
  }

  private token(user: MockUser): string {
    const now     = Math.floor(Date.now() / 1000);
    const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id, name: user.name, email: user.email, role: user.role,
      iat: now, exp: now + 3600,
    }));
    return `${header}.${payload}.mock_sig`;
  }

  private authBody(user: MockUser): object {
    return {
      accessToken:  this.token(user),
      refreshToken: `mock_refresh_${user.id}`,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  private ok(body: object, status = 200): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status, body }));
  }

  private err(status: number, message: string): Observable<HttpEvent<any>> {
    return throwError(() => new HttpErrorResponse({ status, error: { error: message } }));
  }

  private register(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password) return this.err(422, 'All fields required');
    const users = this.users();
    if (users.find(u => u.email === email)) return this.err(409, 'Email already in use');
    users.push({ id: `dev-${Date.now()}`, name, email, password, role: 'member' });
    this.save(users);
    return this.ok({}, 201);
  }

  private login(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { email, password } = req.body ?? {};
    if (email === DEV_ACCOUNT.email && password === DEV_ACCOUNT.password) return this.ok(this.authBody(DEV_ACCOUNT));
    if (email === DEV_ADMIN.email   && password === DEV_ADMIN.password)   return this.ok(this.authBody(DEV_ADMIN));
    const user = this.users().find(u => u.email === email && u.password === password);
    if (!user) return this.err(401, 'Invalid credentials');
    return this.ok(this.authBody(user));
  }

  private refresh(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const rt = (req.body ?? {}).refreshToken ?? '';
    if (!rt.startsWith('mock_refresh_')) return this.err(401, 'Invalid refresh token');
    const userId = rt.replace('mock_refresh_', '');
    if (userId === DEV_ACCOUNT.id) return this.ok(this.authBody(DEV_ACCOUNT));
    if (userId === DEV_ADMIN.id)   return this.ok(this.authBody(DEV_ADMIN));
    const user = this.users().find(u => u.id === userId);
    if (!user) return this.err(401, 'User not found');
    return this.ok(this.authBody(user));
  }

  private userXp(): Observable<HttpEvent<any>> {
    return this.ok({
      totalXp:          250,
      lastSeenXp:       50,
      xpSinceLastVisit: 200,
      level:            3,
      rank:             'Noob',
      xpInCurrentLevel: 50,
      xpPerLevel:       100,
      isMaxLevel:       false,
    });
  }

  private eventsToday(): Observable<HttpEvent<any>> {
    return this.ok({
      events: [
        { id: 'dev-evt-today-1', title: 'Commander Casual Night', event_type: 'casual-commander', scheduled_time: '18:00:00' },
        { id: 'dev-evt-today-2', title: 'cEDH Showdown',          event_type: 'cedh-showdown',    scheduled_time: '18:00:00' },
      ],
    });
  }

  private checkUser(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { userId, eventId } = req.body ?? {};
    if (!userId)  return this.err(400, 'userId required');
    if (!eventId) return this.err(400, 'eventId required');
    const found = (userId === DEV_ACCOUNT.id) ? DEV_ACCOUNT
                : (userId === DEV_ADMIN.id)   ? DEV_ADMIN
                : this.users().find(u => u.id === userId);
    if (!found) return this.err(404, 'User not found');
    return this.ok({
      user:             { id: found.id, name: found.name, email: found.email },
      subscription:     null,
      alreadyCheckedIn: false,
      xpAwarded:        10,
      xp: {
        totalXp: 260, lastSeenXp: 50, xpSinceLastVisit: 210,
        level: 3, rank: 'Noob', xpInCurrentLevel: 60,
        xpPerLevel: 100, isMaxLevel: false,
      },
      message: 'Prezenta confirmata! +10 XP',
    });
  }

  private createEvent(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const b = req.body ?? {};
    if (!b['title'] || !b['date'] || !b['time']) return this.err(422, 'Required fields missing');
    return this.ok({ id: `dev-evt-${Date.now()}`, message: 'Eveniment creat (mod dezvoltare).' }, 201);
  }

  private registerEvent(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { eventId } = req.body ?? {};
    if (!eventId) return this.err(400, 'eventId is required');
    return this.ok({
      registrationId: `dev-reg-${Date.now()}`,
      status: 'pending', amountDue: 0,
      message: 'Inregistrat cu succes (mod dezvoltare).',
    });
  }
}
