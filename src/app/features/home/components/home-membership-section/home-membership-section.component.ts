import { Component } from '@angular/core';

interface JoinStep {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-membership-section',
  standalone: false,
  templateUrl: './home-membership-section.component.html',
  styleUrl: './home-membership-section.component.scss'
})
export class HomeMembershipSectionComponent {
  readonly joinSteps: JoinStep[] = [
    {
      icon: 'fab fa-whatsapp',
      title: 'Intră în Grup',
      description: 'Alătură-te grupului nostru de WhatsApp sau serverului Discord pentru a vedea anunțuri, orar și discuții despre MTG.'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Vino la un Eveniment',
      description: 'Alege seara care ți se potrivește și prezintă-te - nu e nevoie de rezervare prealabilă pentru sesiunile obișnuite.'
    },
    {
      icon: 'fas fa-users',
      title: 'Fă Parte din Comunitate',
      description: 'Joacă, cunoaște oameni, participă la turnee și bucură-te de toate avantajele comunității noastre MTG.'
    }
  ];
}
