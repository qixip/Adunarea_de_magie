import { Component } from '@angular/core';

interface CommunityPillar {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-about-section',
  standalone: false,
  templateUrl: './home-about-section.component.html',
  styleUrl: './home-about-section.component.scss'
})
export class HomeAboutSectionComponent {
  readonly communityPillars: CommunityPillar[] = [
    {
      icon: 'fas fa-users',
      title: 'Comunitate Deschisă',
      description: 'Primim cu brațele deschise jucători de orice nivel - de la începători curioși până la competitori cu experiență.'
    },
    {
      icon: 'fas fa-dice-d20',
      title: 'Formate Variate',
      description: 'Commander casual, cEDH, Pauper, Prerelease și evenimente speciale - fiecare jucător găsește formatul potrivit.'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Locație Fixă',
      description: 'Ne întâlnim săptămânal în același loc, creând o rutină și un spațiu familiar pentru toată lumea.'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Competiție Sănătoasă',
      description: 'Echilibrul dintre fun și competiție este prioritar - venim să ne jucăm, să învățăm și să creștem împreună.'
    }
  ];
}
