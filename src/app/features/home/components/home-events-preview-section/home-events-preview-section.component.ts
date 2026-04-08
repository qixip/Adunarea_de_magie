import { Component } from '@angular/core';

interface HomeFormatHighlight {
  title: string;
  tone: string;
  description: string;
  points: string[];
}

@Component({
  selector: 'app-home-events-preview-section',
  standalone: false,
  templateUrl: './home-events-preview-section.component.html',
  styleUrls: ['./home-events-preview-section.component.scss']
})
export class HomeEventsPreviewSectionComponent {
  readonly formatHighlights: HomeFormatHighlight[] = [
    {
      title: 'Commander Casual',
      tone: 'Relaxat',
      description: 'Pods de 4 jucători, social play și mult loc pentru deck-uri creative, upgrade-uri și povești memorabile.',
      points: ['Power level prietenos', 'Ideal pentru jucători noi', 'Accent pe comunitate și fun']
    },
    {
      title: 'Commander Competitiv',
      tone: 'cEDH',
      description: 'Pentru cei care iubesc liniile precise, interacțiunile rapide și mesele unde fiecare decizie contează.',
      points: ['Meta puternic și optimizat', 'Pods competitive', 'Focus pe execuție și timing']
    },
    {
      title: 'Pauper',
      tone: 'Format accesibil',
      description: 'Un format excelent pentru testare, skill expression și deckbuilding inteligent, fără a sparge bugetul.',
      points: ['Doar cărți common', 'Partide tehnice și rapide', 'Perfect pentru ligă locală']
    },
    {
      title: 'Special Event',
      tone: 'Experiență premium',
      description: 'Prerelease-uri, aniversări de comunitate și seri tematice cu premii, atmosferă specială și surprize.',
      points: ['Evenimente unice', 'Premii și goodies', 'Momente speciale pentru toți jucătorii']
    }
  ];
}
