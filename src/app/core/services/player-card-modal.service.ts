import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlayerCardModalService {
  private readonly open$ = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.open$.asObservable();

  open(): void   { this.open$.next(true); }
  close(): void  { this.open$.next(false); }
  toggle(): void { this.open$.next(!this.open$.getValue()); }
}