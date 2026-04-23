import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MtgEvent, EventType } from '../../../../shared/models/event.model';
import { AuthService } from '../../../../core/services/auth.service';
import { RegistrationService, RegistrationResult } from '../../../../core/services/registration.service';

export interface EventRequirement {
  label: string;
  description: string;
  met: boolean;
}

type RegState = 'idle' | 'loading' | 'done' | 'error';

@Component({
  selector: 'app-event-detail-modal',
  standalone: false,
  templateUrl: './event-detail-modal.component.html',
  styleUrls: ['./event-detail-modal.component.scss']
})
export class EventDetailModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) event!: MtgEvent;
  @Output() close      = new EventEmitter<void>();
  @Output() registered = new EventEmitter<void>();

  regState: RegState = 'idle';
  regMessage = '';
  requirements: EventRequirement[] = [];

  readonly fallbackImage = 'assets/images/Logo_no_background.png';
  private readonly LUNAR_INCLUDED: EventType[] = ['casual-commander', 'board-game', 'special-formats'];

  constructor(
    private auth: AuthService,
    private reg: RegistrationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    document.body.classList.add('modal-open');
    this.buildRequirements();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }

  get isAuthenticated() { return this.auth.isAuthenticated; }
  get user()            { return this.auth.currentUser; }
  get subscription()    { return this.reg.subscription; }
  get price()           { return this.reg.priceFor(this.event); }
  get isIncluded()      { return this.reg.isIncluded(this.event.eventType); }
  get isFull()          { return this.event.status === 'full' || this.event.spotsLeft <= 0; }
  get canRegister()     { return this.isAuthenticated && !this.isFull && this.regState === 'idle'; }

  get priceLabel(): string {
    if (this.event.eventType === 'open-market') return 'Gratuit';
    if (this.isIncluded) return 'Inclus în abonament';
    return `${this.price} RON`;
  }

  get priceBreakdown(): { label: string; value: string; highlight?: boolean }[] {
    if (this.event.eventType === 'open-market') {
      return [{ label: 'Participare', value: 'Gratuită', highlight: true }];
    }
    const rows: { label: string; value: string; highlight?: boolean }[] = [];
    if (this.event.feeStandard > 0) {
      rows.push({ label: 'Preț standard', value: `${this.event.feeStandard} RON` });
    }
    if (this.event.feeMember < this.event.feeStandard) {
      rows.push({ label: 'Preț abonat', value: `${this.event.feeMember} RON` });
    }
    rows.push({
      label: 'Tu plăteşti',
      value: this.isIncluded ? 'Gratuit (inclus)' : `${this.price} RON`,
      highlight: true
    });
    return rows;
  }

  private buildRequirements(): void {
    this.requirements = [];
    this.requirements.push({
      label: 'Cont înregistrat',
      description: this.isAuthenticated
        ? `Autentificat ca ${this.user?.name}`
        : 'Trebuie să te autentifici pentru a rezerva un loc.',
      met: this.isAuthenticated,
    });
    if (this.event.eventType !== 'open-market') {
      const isLunarType = this.LUNAR_INCLUDED.includes(this.event.eventType);
      const hasLunar = this.subscription?.type === 'lunar';
      this.requirements.push({
        label: isLunarType ? 'Abonament Lunar' : 'Abonament Lunar (opțional)',
        description: hasLunar
          ? isLunarType
            ? 'Ai Abonament Lunar activ — participarea este gratuită.'
            : `Ai Abonament Lunar — beneficiezi de preț redus (${this.event.feeMember} RON).`
          : isLunarType
            ? 'Fără abonament — participarea costă 30 RON/sesiune (Intrare Casual).'
            : `Fără abonament — preț standard ${this.event.feeStandard} RON.`,
        met: hasLunar,
      });
    }
    this.requirements.push({
      label: 'Locuri disponibile',
      description: this.isFull
        ? 'Evenimentul este complet.'
        : `${this.event.spotsLeft} din ${this.event.capacity} locuri disponibile.`,
      met: !this.isFull,
    });
  }

  reserve(): void {
    if (!this.isAuthenticated) {
      this.close.emit();
      this.router.navigate(['/auth']);
      return;
    }
    this.regState = 'loading';
    this.reg.register(this.event.id).subscribe({
      next: (result: RegistrationResult) => {
        this.regState = 'done';
        this.regMessage = result.message;
        this.event = { ...this.event, spotsLeft: this.event.spotsLeft - 1 };
        this.registered.emit();
      },
      error: (err: any) => {
        this.regState = 'error';
        this.regMessage = err?.error?.error ?? 'Rezervarea a eşuat. Încercă din nou.';
      },
    });
  }

  closeModal(): void { this.close.emit(); }
}
