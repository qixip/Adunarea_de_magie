import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EventFormat } from '../../../../shared/models/event.model';

export type FilterFormat = 'all' | EventFormat;

@Component({
  selector: 'app-events-filter-toolbar',
  standalone: false,
  templateUrl: './events-filter-toolbar.component.html',
  styleUrls: ['./events-filter-toolbar.component.scss']
})
export class EventsFilterToolbarComponent {
  @Input() formats: FilterFormat[] = [];
  @Input() activeFormat: FilterFormat = 'all';
  @Output() formatChange = new EventEmitter<FilterFormat>();

  selectFormat(format: FilterFormat): void {
    this.formatChange.emit(format);
  }

  trackByFormat(_index: number, format: FilterFormat): string {
    return format;
  }
}
