import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { EventType, EventFormat, EVENT_TYPE_FORMAT_MAP } from '../../../../shared/models/event.model';

type FormState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-add-event',
  standalone: false,
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
})
export class AddEventComponent {
  formState: FormState = 'idle';
  successMsg = '';
  errorMsg = '';

  eventTypes: EventType[] = [
    'casual-commander',
    'board-game',
    'special-formats',
    'pauper',
    'pauper-prize',
    'cedh-showdown',
    'cedh-league',
    'open-market',
  ];

  eventTypeLabels: Record<EventType, string> = {
    'casual-commander': 'Commander Casual',
    'board-game':       'Board Game',
    'special-formats':  'Special Formats',
    'pauper':           'Pauper',
    'pauper-prize':     'Pauper Prize',
    'cedh-showdown':    'cEDH Showdown',
    'cedh-league':      'cEDH League',
    'open-market':      'Open Market',
  };

  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(3)]],
      eventType:   ['casual-commander', Validators.required],
      date:        ['', Validators.required],
      time:        ['', Validators.required],
      location:    ['Arcana Inn', Validators.required],
      capacity:    [30, [Validators.required, Validators.min(1), Validators.max(500)]],
      feeStandard: [0, [Validators.required, Validators.min(0)]],
      feeMember:   [0, [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }

  get formatForType(): EventFormat {
    return EVENT_TYPE_FORMAT_MAP[this.form.value.eventType as EventType];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formState = 'loading';
    const payload = { ...this.form.value, format: this.formatForType };
    this.http.post(`${environment.apiBaseUrl}/api/admin/create-event`, payload).subscribe({
      next: () => {
        this.formState = 'success';
        this.successMsg = 'Evenimentul a fost creat cu succes!';
        this.form.reset({
          eventType: 'casual-commander',
          location: 'Arcana Inn',
          capacity: 30,
          feeStandard: 0,
          feeMember: 0,
        });
      },
      error: err => {
        this.errorMsg = err?.error?.error ?? 'Eroare la crearea evenimentului.';
        this.formState = 'error';
      }
    });
  }

  resetState(): void {
    this.formState = 'idle';
    this.errorMsg = '';
    this.successMsg = '';
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }
}
