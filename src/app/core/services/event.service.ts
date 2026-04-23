import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import {
  MtgEvent, EventType,
  EVENT_TYPE_FORMAT_MAP, formatDateRo
} from '../../shared/models/event.model';
import { environment } from '../../../environments/environment';

interface ApiEvent {
  id: string;
  title: string;
  event_type: EventType;
  scheduled_date: string;
  scheduled_time: string;
  location: string;
  capacity: number;
  spots_left: number;
  status: 'upcoming' | 'today' | 'full' | 'past';
  description: string | null;
  fee_standard: string | number;
  fee_member: string | number;
  userRegistrationStatus?: 'pending' | 'confirmed' | 'cancelled' | null;
}

function mapEvent(e: ApiEvent): MtgEvent {
  return {
    id:                     e.id,
    title:                  e.title,
    eventType:              e.event_type,
    format:                 EVENT_TYPE_FORMAT_MAP[e.event_type],
    date:                   formatDateRo(e.scheduled_date),
    time:                   e.scheduled_time.substring(0, 5),
    location:               e.location,
    capacity:               e.capacity,
    spotsLeft:              e.spots_left,
    status:                 e.status,
    description:            e.description ?? undefined,
    feeStandard:            Number(e.fee_standard),
    feeMember:              Number(e.fee_member),
    userRegistrationStatus: e.userRegistrationStatus ?? null,
    imageUrl:               'assets/images/Logo_no_background.png',
  };
}

const FALLBACK: MtgEvent[] = [
  { id:'cedh-league-2026-04-22', title:'cEDH League Night', eventType:'cedh-league',
    format:'Commander Competitiv', date:'22 Aprilie', time:'18:00',
    location:'Locație centrală, Bucureşti', capacity:30, spotsLeft:25, status:'upcoming',
    description:'Meciuri din Liga Lunară cEDH. Acumulează puncte pentru clasament.',
    feeStandard:200, feeMember:180, imageUrl:'assets/images/Logo_no_background.png' },
  { id:'pauper-2026-04-23', title:'Pauper Night', eventType:'pauper',
    format:'Pauper', date:'23 Aprilie', time:'18:00',
    location:'Locație centrală, Bucureşti', capacity:30, spotsLeft:18, status:'upcoming',
    description:'Format Pauper. 4 runde Swiss, premii pentru top finishers.',
    feeStandard:35, feeMember:30, imageUrl:'assets/images/Logo_no_background.png' },
  { id:'cmd-casual-2026-04-24', title:'Casual Commander Night', eventType:'casual-commander',
    format:'Commander Casual', date:'24 Aprilie', time:'18:00',
    location:'Locație centrală, Bucureşti', capacity:30, spotsLeft:22, status:'upcoming',
    description:'Seară dedicată Commander casual, proxy friendly, power level 1–7.',
    feeStandard:30, feeMember:0, imageUrl:'assets/images/Logo_no_background.png' },
  { id:'board-game-2026-04-25', title:'Board Game Night', eventType:'board-game',
    format:'Special Event', date:'25 Aprilie', time:'18:00',
    location:'Locație centrală, Bucureşti', capacity:30, spotsLeft:20, status:'upcoming',
    description:'Seară dedicată board game-urilor şi activităților sociale.',
    feeStandard:30, feeMember:0, imageUrl:'assets/images/Logo_no_background.png' },
  { id:'cedh-showdown-2026-04-26', title:'cEDH Showdown', eventType:'cedh-showdown',
    format:'Commander Competitiv', date:'26 Aprilie', time:'14:00',
    location:'Locație centrală, Bucureşti', capacity:16, spotsLeft:11, status:'upcoming',
    description:'Eveniment competitiv dedicat jucătorilor de cEDH.',
    feeStandard:35, feeMember:30, imageUrl:'assets/images/Logo_no_background.png' },
  { id:'open-market-2026-04-27', title:'Open Market Sunday', eventType:'open-market',
    format:'Special Event', date:'27 Aprilie', time:'12:00',
    location:'Locație centrală, Bucureşti', capacity:30, spotsLeft:30, status:'upcoming',
    description:'Trade, vânzare şi schimburi. Participare gratuită.',
    feeStandard:0, feeMember:0, imageUrl:'assets/images/Logo_no_background.png' },
];

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<MtgEvent[]> {
    return this.http
      .get<{ events: ApiEvent[] }>(`${environment.apiBaseUrl}/api/events`)
      .pipe(
        map(r => r.events.map(mapEvent)),
        catchError(() => of(FALLBACK))
      );
  }

  getUpcoming(): Observable<MtgEvent[]> { return this.getAll(); }

  getById(id: string): Observable<MtgEvent | null> {
    return this.getAll().pipe(map(events => events.find(e => e.id === id) ?? null));
  }
}
