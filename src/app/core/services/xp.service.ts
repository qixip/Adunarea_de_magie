import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserXpData } from '../../shared/models/xp.model';

@Injectable({ providedIn: 'root' })
export class XpService {
  private _data$ = new BehaviorSubject<UserXpData | null>(null);
  readonly xpData$ = this._data$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<UserXpData> {
    return this.http.get<UserXpData>(`${environment.apiBaseUrl}/api/user/xp`).pipe(
      tap(data => this._data$.next(data))
    );
  }

  clear(): void {
    this._data$.next(null);
  }
}
