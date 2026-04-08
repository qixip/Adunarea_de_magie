import { Component, Input } from '@angular/core';
import { MtgEvent } from '../../../../shared/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: false,
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  @Input({ required: true }) event!: MtgEvent;

  readonly fallbackImageUrl = 'assets/images/Logo_no_background.png';
}
