import { Component, OnInit } from '@angular/core';
import { MtgEvent, EventFormat } from '../../shared/models/event.model';
import { EventService } from '../../core/services/event.service';

type FilterFormat = 'all' | EventFormat;

@Component({
  selector: 'app-events',
  standalone: false,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  private allEvents: MtgEvent[] = [];
  filtered: MtgEvent[] = [];
  activeFormat: FilterFormat = 'all';
  selectedEvent: MtgEvent | null = null;

  readonly formats: FilterFormat[] = [
    'all', 'Commander Casual', 'Commander Competitiv', 'Pauper', 'Special Event'
  ];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getAll().subscribe(events => {
      this.allEvents = events;
      this.applyFilter();
    });
  }

  setFormat(format: FilterFormat): void {
    this.activeFormat = format;
    this.applyFilter();
  }

  openModal(event: MtgEvent): void {
    this.selectedEvent = event;
  }

  closeModal(): void {
    this.selectedEvent = null;
  }

  onRegistered(): void {
    this.closeModal();
    this.eventService.getAll().subscribe(events => {
      this.allEvents = events;
      this.applyFilter();
    });
  }

  trackByEventId(_index: number, event: MtgEvent): string {
    return event.id;
  }

  private applyFilter(): void {
    this.filtered = this.activeFormat === 'all'
      ? [...this.allEvents]
      : this.allEvents.filter(e => e.format === this.activeFormat);
  }
}
