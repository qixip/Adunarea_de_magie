import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MtgEvent } from '../../../../shared/models/event.model';
import { AuthService } from '../../../../core/services/auth.service';
import { RegistrationService, RegistrationResult } from '../../../../core/services/registration.service';

type RegState = 'idle' | 'confirming' | 'loading' | 'done' | 'error';

@Component({
  selector: 'app-event-card',
  standalone: false,
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input({ required: true }) event!: MtgEvent;

  readonly fallbackImageUrl = 'assets/images/Logo_no_background.png';

  regState: RegState = 'idle';
  regMessage = '';
  amountDue = 0;

  constructor(
    private auth: AuthService,
    private reg: RegistrationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.event.userRegistrationStatus === 'confirmed' ||
        this.event.userRegistrationStatus === 'pending') {
      this.regState = 'done';
      this.regMessage = this.event.userRegistrationStatus === 'confirmed'
        ? 'Loc rezervat!'
        : 'Rezervare in asteptare';
    }
  }

  get isAuthenticated(): boolean { return this.auth.isAuthenticated; }
  get isFull(): boolean { return this.event.status === 'full' || this.event.spotsLeft <= 0; }
  get price(): number { return this.reg.priceFor(this.event); }
  get isIncluded(): boolean { return this.reg.isIncluded(this.event.eventType); }

  get formatClass(): string {
    return 'format-' + this.event.format.toLowerCase().replace(/\s+/g, '-');
  }

  get priceLabel(): string {
    if (this.event.eventType === 'open-market') return 'Gratuit';
    if (this.isIncluded) return 'Inclus in abonament';
    return this.price + ' RON';
  }

  onRegisterClick(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth']);
      return;
    }
    if (this.regState === 'idle') {
      this.amountDue = this.price;
      this.regState = 'confirming';
    }
  }

  confirm(): void {
    this.regState = 'loading';
    this.reg.register(this.event.id).subscribe({
      next: (result: RegistrationResult) => {
        this.regState = 'done';
        this.regMessage = result.message;
        this.event = { ...this.event, spotsLeft: this.event.spotsLeft - 1 };
      },
      error: (err) => {
        this.regState = 'error';
        this.regMessage = err?.error?.error ?? 'Inregistrare esuata. Reincearca.';
      },
    });
  }

  cancel(): void {
    this.regState = 'idle';
  }

  retry(): void {
    this.regState = 'idle';
  }
}
