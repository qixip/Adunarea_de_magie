import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService, AuthUser } from './auth.service';
import { RegistrationService } from './registration.service';
import { UserSubscription } from '../../shared/models/subscription.model';

export interface PlayerProfile {
  user: AuthUser;
  subscription: UserSubscription | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly profile$: Observable<PlayerProfile | null>;

  constructor(private auth: AuthService, private reg: RegistrationService) {
    this.profile$ = combineLatest([
      this.auth.user$,
      this.reg.subscription$,
    ]).pipe(
      map(([user, subscription]) => (user ? { user, subscription } : null))
    );
  }
}