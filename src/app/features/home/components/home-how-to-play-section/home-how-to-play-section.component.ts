import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-how-to-play-section',
  standalone: false,
  templateUrl: './home-how-to-play-section.component.html',
  styleUrls: ['./home-how-to-play-section.component.scss']
})
export class HomeHowToPlaySectionComponent {
  constructor(private router: Router) {}

  goToSchedule(): void {
    this.router.navigate(['/'], { fragment: 'orar' }).then(() => {
      setTimeout(() => {
        const el = document.getElementById('orar');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    });
  }
}
