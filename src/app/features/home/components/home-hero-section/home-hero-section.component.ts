import { Component, Input } from '@angular/core';

export interface HeroStat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home-hero-section',
  standalone: false,
  templateUrl: './home-hero-section.component.html',
  styleUrls: ['./home-hero-section.component.scss']
})
export class HomeHeroSectionComponent {
  @Input() stats: HeroStat[] = [];
}
