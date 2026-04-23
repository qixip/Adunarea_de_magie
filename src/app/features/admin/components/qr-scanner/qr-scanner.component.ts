import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeFormat } from '@zxing/library';
import { environment } from '../../../../../environments/environment';
import { UserXpData } from '../../../../shared/models/xp.model';

export interface TodayEvent {
  id:             string;
  title:          string;
  event_type:     string;
  scheduled_time: string;
}

export interface AdminCheckResult {
  user: { id: string; name: string; email: string };
  subscription: { type: string; valid_until: string } | null;
  alreadyCheckedIn: boolean;
  xpAwarded:        number;
  xp:               UserXpData | null;
  message:          string;
}

type ScanState = 'idle' | 'scanning' | 'loading' | 'result' | 'error';

@Component({
  selector: 'app-qr-scanner',
  standalone: false,
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit, OnDestroy {
  scanState: ScanState = 'idle';
  result: AdminCheckResult | null = null;
  errorMsg = '';
  currentDevice: MediaDeviceInfo | undefined;
  scannerEnabled = false;
  readonly formats = [BarcodeFormat.QR_CODE];

  todayEvents: TodayEvent[] = [];
  selectedEventId = '';
  loadingEvents   = true;
  noEventsToday   = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void { this.loadTodayEvents(); }
  ngOnDestroy(): void { this.scannerEnabled = false; }

  private loadTodayEvents(): void {
    this.loadingEvents = true;
    this.http.get<{ events: TodayEvent[] }>(`${environment.apiBaseUrl}/api/events/today`).subscribe({
      next: res => {
        this.todayEvents    = res.events;
        this.noEventsToday  = res.events.length === 0;
        if (res.events.length === 1) this.selectedEventId = res.events[0].id;
        this.loadingEvents  = false;
      },
      error: () => {
        this.noEventsToday = true;
        this.loadingEvents  = false;
      },
    });
  }

  async startScanner(): Promise<void> {
    if (!this.selectedEventId) return;
    this.scanState = 'scanning';
    this.result    = null;
    this.errorMsg  = '';

    if (!navigator.mediaDevices?.getUserMedia) {
      this.errorMsg  = 'Camera nu este disponibilă. Asigurați-vă că pagina este servită prin HTTPS.';
      this.scanState = 'error';
      return;
    }

    try {
      const stream         = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
      const activeDeviceId = stream.getVideoTracks()[0]?.getSettings()?.deviceId;
      stream.getTracks().forEach(t => t.stop());

      const all          = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = all.filter(d => d.kind === 'videoinput');

      if (videoDevices.length === 0) {
        this.errorMsg  = 'Nu a fost găsită nicio cameră pe acest dispozitiv.';
        this.scanState = 'error';
        return;
      }

      this.currentDevice =
        videoDevices.find(d => d.deviceId === activeDeviceId) ??
        videoDevices.find(d => /back|rear|environment/i.test(d.label)) ??
        videoDevices[0];

      this.scannerEnabled = true;
    } catch (err: unknown) {
      const e = err as DOMException;
      if (e?.name === 'NotAllowedError')  this.errorMsg = 'Accesul la cameră a fost refuzat. Permiteți accesul în setările browserului.';
      else if (e?.name === 'NotFoundError')   this.errorMsg = 'Nu a fost găsită nicio cameră pe acest dispozitiv.';
      else if (e?.name === 'NotReadableError') this.errorMsg = 'Camera este folosită de altă aplicație. Închideți celelalte aplicații și încercați din nou.';
      else this.errorMsg = `Camera nu poate fi pornită (${e?.name ?? 'eroare necunoscută'}).`;
      this.scanState = 'error';
    }
  }

  stopScanner(): void {
    this.scannerEnabled = false;
    this.scanState      = 'idle';
  }

  onScanSuccess(userId: string): void {
    this.scannerEnabled = false;
    this.scanState      = 'loading';
    this.http.post<AdminCheckResult>(
      `${environment.apiBaseUrl}/api/admin/check-user`,
      { userId, eventId: this.selectedEventId }
    ).subscribe({
      next:  res => { this.result = res; this.scanState = 'result'; },
      error: err => { this.errorMsg = err?.error?.error ?? 'Eroare la verificare.'; this.scanState = 'error'; },
    });
  }

  onScanError(err: unknown): void { console.error('Scan error', err); }

  /** Keep selected event, just go back to idle for next scan. */
  scanAnother(): void {
    this.result    = null;
    this.errorMsg  = '';
    this.scanState = 'idle';
    this.scannerEnabled = false;
  }

  reset(): void {
    this.result          = null;
    this.errorMsg        = '';
    this.scanState       = 'idle';
    this.scannerEnabled  = false;
    this.currentDevice   = undefined;
    this.selectedEventId = this.todayEvents.length === 1 ? this.todayEvents[0].id : '';
  }

  get selectedEvent(): TodayEvent | undefined {
    return this.todayEvents.find(e => e.id === this.selectedEventId);
  }

  formatTime(t: string): string {
    return t ? t.slice(0, 5) : '';
  }
}
