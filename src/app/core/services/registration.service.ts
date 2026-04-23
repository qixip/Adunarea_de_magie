import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserSubscription } from '../../shared/models/subscription.model';
import { EventType, MtgEvent } from '../../shared/models/event.model';
import { environment } from '../../../environments/environment';

export interface RegistrationResult {
  registrationId: string;
  status: 'pending' | 'confirmed';
  amountDue: number;
  message: string;
}

const LUNAR_INCLUDED: EventType[] = ['casual-commander', 'board-game', 'special-formats'];

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private sub$ = new BehaviorSubject<UserSubscription | null>(null);
  readonly subscription$ = this.sub$.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.user$.subscribe(user => {
      if (user) this.loadSubscription();
      else this.sub$.next(null);
    });
  }

  get subscription(): UserSubscription | null { return this.sub$.getValue(); }

  private loadSubscription(): void {
    this.http
      .get<{ subscription: UserSubscription | null }>(
        `${environment.apiBaseUrl}/api/user/subscription`
      )
      .subscribe({
        next: r => this.sub$.next(r.subscription),
        error: () => this.sub$.next(null),
      });
  }

  isIncluded(eventType: EventType): boolean {
    if (eventType === 'open-market') return true;
    const sub = this.subscription;
    return sub?.type === 'lunar' && LUNAR_INCLUDED.includes(eventType);
  }

  priceFor(event: MtgEvent): number {
    if (event.eventType === 'open-market') return 0;
    if (this.isIncluded(event.eventType)) return 0;
    return this.subscription ? event.feeMember : event.feeStandard;
  }

  register(eventId: string): Observable<RegistrationResult> {
    return this.http.post<RegistrationResult>(
      `${environment.apiBaseUrl}/api/events/register`,
      { eventId }
    );
  }
}
