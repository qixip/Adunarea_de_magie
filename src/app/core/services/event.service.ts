import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MtgEvent } from '../../shared/models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {

    private readonly events: MtgEvent[] = [
    {
      id: 'cmd-casual-2026-04-12',
      title: 'Commander Casual',
      format: 'Commander Casual',
      date: '12 Aprilie',
      time: '12:00',
      location: 'Locație centrală, București',
      capacity: 20,
      spotsLeft: 8,
      status: 'upcoming',
      imageUrl: 'assets/images/Logo_no_background.png',
      description: 'Sesiune deschisă tuturor pentru pods casual și social play. Atmosferă prietenoasă, power level 1-7.'
    },
    {
      id: 'cmd-comp-2026-04-13',
      title: 'Commander Competitiv – Turneu cEDH',
      format: 'Commander Competitiv',
      date: '13 Aprilie',
      time: '14:00',
      location: 'Locație centrală, București',
      capacity: 16,
      spotsLeft: 5,
      status: 'upcoming',
      imageUrl: 'assets/images/Logo_no_background.png',
      description: 'Turneu Commander competitiv (cEDH) cu pods optimizate, prize pool și structură Swiss.'
    },
    {
      id: 'pauper-2026-04-14',
      title: 'Pauper League',
      format: 'Pauper',
      date: '14 Aprilie',
      time: '18:00',
      location: 'Locație centrală, București',
      capacity: 24,
      spotsLeft: 12,
      status: 'upcoming',
      imageUrl: 'assets/images/Logo_no_background.png',
      description: 'Format Pauper friendly pentru jucători noi și veterani. 4 runde Swiss, premii pentru top finishers.'
    },
    {
      id: 'special-2026-04-20',
      title: 'Prerelease – Eveniment Special',
      format: 'Special Event',
      date: '20 Aprilie',
      time: '11:00 și 16:00',
      location: 'Locație centrală, București',
      capacity: 32,
      spotsLeft: 7,
      status: 'upcoming',
      imageUrl: 'assets/images/Logo_no_background.png',
      description: 'Eveniment oficial Prerelease cu kit complet Wizards, promoții exclusive și două sloturi de participare.'
    },
    {
      id: 'cmd-casual-2026-04-21',
      title: 'Commander Casual – Sunday Funday',
      format: 'Commander Casual',
      date: '21 Aprilie',
      time: '12:00',
      location: 'Locație centrală, București',
      capacity: 20,
      spotsLeft: 15,
      status: 'upcoming',
      imageUrl: 'assets/images/Logo_no_background.png',
      description: 'Joacă Commander într-o atmosferă relaxată. Perfect pentru deck testing și sociale.'
    },
    {
      id: 'pauper-2026-04-27',
      title: 'Pauper Monthly Championship',
      format: 'Pauper',
      date: '27 Aprilie',
      time: '14:00',
      location: 'Locație centrală, București',
      capacity: 32,
      spotsLeft: 18,
      status: 'upcoming',
      imageUrl: 'assets/images/Logo_no_background.png',
      description: 'Campionatul lunar Pauper cu prize pool extins și calificare la evenimentul național.'
    }
  ];

  getUpcoming() {
    return of(this.events.filter(e => e.status !== 'past'));
  }

  getAll() {
    return of(this.events);
  }

  getById(id: string) {
    return of(this.events.find(e => e.id === id) ?? null);
  }
}


