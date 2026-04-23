import { Component } from '@angular/core';

interface ScheduleSession {
  day: string;
  format: string;
  name: string;
  description: string;
  time: string;
  location: string;
  closed?: boolean;
  maxSpots?: number;
  isFree?: boolean;
}

@Component({
  selector: 'app-home-schedule-section',
  standalone: false,
  templateUrl: './home-schedule-section.component.html',
  styleUrls: ['./home-schedule-section.component.scss']
})
export class HomeScheduleSectionComponent {
  readonly sessions: ScheduleSession[] = [
    {
      day: 'Marți',
      format: 'cEDH Competitiv',
      name: 'cEDH League Night',
      description: 'Meciuri din Liga Lunară cEDH — acumulează puncte pentru clasament și calificare în finală.',
      time: '18:00',
      location: 'Locație centrală, București',
      maxSpots: 30
    },
    {
      day: 'Miercuri',
      format: 'Pauper & Formate Speciale',
      name: 'Pauper + Special Formats',
      description: 'Pauper, drafturi, proxy formats și evenimente speciale.',
      time: '18:00',
      location: 'Locație centrală, București',
      maxSpots: 30
    },
    {
      day: 'Joi',
      format: 'Commander Casual',
      name: 'Casual Commander Night',
      description: 'Atmosferă prietenoasă, proxy friendly. Putere 1–7.',
      time: '18:00',
      location: 'Locație centrală, București',
      maxSpots: 30
    },
    {
      day: 'Vineri',
      format: 'Board Games & Social',
      name: 'Board Game Night',
      description: 'Seară dedicată board game-urilor și activităților sociale.',
      time: '18:00',
      location: 'Locație centrală, București',
      maxSpots: 30
    },
    {
      day: 'Sâmbătă',
      format: 'Commander & cEDH',
      name: 'Commander Saturday',
      description: 'Casual Commander + cEDH Showdown. Ultima sâmbătă din lună: Finala Ligii Lunare cEDH.',
      time: '14:00',
      location: 'Locație centrală, București',
      maxSpots: 30
    },
    {
      day: 'Duminică',
      format: 'Târg comunitate',
      name: 'Open Market Sunday',
      description: 'Trade, vânzare, schimburi de cărți, accesorii și board games. Participare gratuită.',
      time: '12:00',
      location: 'Locație centrală, București',
      isFree: true
    }
  ];
}
