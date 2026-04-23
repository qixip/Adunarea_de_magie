import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerProfile, UserService } from '../../../core/services/user.service';
import { PlayerCardModalService } from '../../../core/services/player-card-modal.service';
import { XpService } from '../../../core/services/xp.service';
import { UserXpData } from '../../models/xp.model';

const MONTHS_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];

@Component({
  selector: 'app-player-card-modal',
  standalone: false,
  templateUrl: './player-card-modal.component.html',
  styleUrls: ['./player-card-modal.component.scss'],
})
export class PlayerCardModalComponent implements OnInit, OnDestroy {
  readonly profile$: Observable<PlayerProfile | null>;
  readonly isOpen$:  Observable<boolean>;
  readonly xpData$:  Observable<UserXpData | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private modalService: PlayerCardModalService,
    private xpService: XpService,
  ) {
    this.profile$ = this.userService.profile$;
    this.isOpen$  = this.modalService.isOpen$;
    this.xpData$  = this.xpService.xpData$;
  }

  ngOnInit(): void {
    // Load (or reload) XP data each time the modal opens
    this.isOpen$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      if (open) this.xpService.load().pipe(takeUntil(this.destroy$)).subscribe();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close(): void { this.modalService.close(); }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.modalService.close(); }

  formatDate(isoDate: string): string {
    const [, m, d] = isoDate.split('-');
    return `${parseInt(d, 10)} ${MONTHS_RO[parseInt(m, 10) - 1]}`;
  }

  subTypeLabel(type: string): string {
    return type === 'lunar' ? 'Abonament Lunar' : type;
  }
}
