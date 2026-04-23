import {
  Component, Input, OnChanges, OnDestroy,
  SimpleChanges, ChangeDetectorRef,
} from '@angular/core';
import { UserXpData } from '../../models/xp.model';
import {
  getLevel, getRank, getXpInCurrentLevel,
  rankAtMilestone, XP_PER_LEVEL, MAX_LEVEL,
} from '../../utils/xp-utils';

@Component({
  selector: 'app-xp-bar',
  standalone: false,
  templateUrl: './xp-bar.component.html',
  styleUrls: ['./xp-bar.component.scss'],
})
export class XpBarComponent implements OnChanges, OnDestroy {
  @Input() xpData: UserXpData | null = null;
  /** Skip the fill animation and jump straight to current state. */
  @Input() noAnimation = false;

  fillPercent    = 0;
  fillDurationMs = 0;
  displayedLevel = 1;
  displayedRank  = 'Noob';
  xpText         = '0/100';
  isMaxLevel     = false;

  showLevelUpBurst = false;
  showRankUpBurst  = false;
  burstRankName    = '';

  private dead = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xpData'] && this.xpData) this.begin();
  }

  ngOnDestroy(): void { this.dead = true; }

  private begin(): void {
    const d = this.xpData!;

    if (this.noAnimation || d.xpSinceLastVisit === 0) {
      this.applyState(d.totalXp, 0);
      return;
    }

    // Initialise to where the user last saw themselves, then animate forward
    this.applyState(d.lastSeenXp, 0);
    setTimeout(() => this.runAnimation(d.lastSeenXp, d.totalXp), 500);
  }

  private applyState(xp: number, durationMs: number): void {
    const level = getLevel(xp);
    this.displayedLevel = level;
    this.displayedRank  = getRank(level);
    this.isMaxLevel     = level >= MAX_LEVEL;
    const xpInLevel     = getXpInCurrentLevel(xp);
    this.xpText         = this.isMaxLevel ? 'MAX LEVEL' : `${xpInLevel}/100 XP`;
    this.fillDurationMs = durationMs;
    this.fillPercent    = this.isMaxLevel ? 100 : (xpInLevel / XP_PER_LEVEL) * 100;
    this.cdr.detectChanges();
  }

  private async runAnimation(from: number, to: number): Promise<void> {
    if (this.dead) return;
    let cur = from;

    while (cur < to) {
      if (this.dead) return;

      const curLevel    = getLevel(cur);
      const nextLvlXp   = curLevel * XP_PER_LEVEL; // first XP of the next level
      const isFinal     = nextLvlXp > to || curLevel >= MAX_LEVEL;
      const segmentEnd  = isFinal ? to : nextLvlXp;

      const startPct    = (getXpInCurrentLevel(cur) / XP_PER_LEVEL) * 100;
      const endPct      = isFinal
        ? (curLevel >= MAX_LEVEL ? 100 : (getXpInCurrentLevel(to) / XP_PER_LEVEL) * 100)
        : 100;

      const fillFraction = Math.max((endPct - startPct) / 100, 0.04);
      const dur          = Math.round(1200 * fillFraction);

      // Animate fill for this segment
      if (isFinal) {
        const xpInLevel     = getXpInCurrentLevel(to);
        this.isMaxLevel     = curLevel >= MAX_LEVEL;
        this.xpText         = this.isMaxLevel ? 'MAX LEVEL' : `${xpInLevel}/100 XP`;
      }
      this.fillDurationMs = dur;
      this.fillPercent    = endPct;
      this.cdr.detectChanges();

      await this.sleep(dur);
      if (this.dead) return;

      cur = segmentEnd;

      if (!isFinal) {
        // A level boundary was crossed — fire level-up animation
        const newLevel = getLevel(cur);
        this.displayedLevel = newLevel;
        this.displayedRank  = getRank(newLevel);
        this.isMaxLevel     = newLevel >= MAX_LEVEL;

        const rankName = rankAtMilestone(newLevel);
        if (rankName) {
          this.burstRankName   = rankName;
          this.showRankUpBurst = true;
          this.cdr.detectChanges();
          await this.sleep(2800);
          if (this.dead) return;
          this.showRankUpBurst = false;
        } else {
          this.showLevelUpBurst = true;
          this.cdr.detectChanges();
          await this.sleep(1000);
          if (this.dead) return;
          this.showLevelUpBurst = false;
        }

        // Instant reset to 0 for the next segment
        this.fillDurationMs = 0;
        this.fillPercent    = 0;
        this.xpText         = '0/100 XP';
        this.cdr.detectChanges();
        await this.sleep(60);
      }
    }

    // Lock to final correct state
    this.applyState(to, 0);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }
}
