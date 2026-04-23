import { Component } from '@angular/core';

interface EventFee {
  name: string;
  standardPrice: number;
  memberPrice: number;
}

interface PricingFaq {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: false,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  readonly eventFees: EventFee[] = [
    { name: 'Pauper \u2013 Entry',         standardPrice: 35,  memberPrice: 30  },
    { name: 'Pauper \u2013 Prize Support', standardPrice: 55,  memberPrice: 50  },
    { name: 'cEDH Showdown',               standardPrice: 35,  memberPrice: 30  },
    { name: 'Liga Lunar\u0103 cEDH',       standardPrice: 200, memberPrice: 180 }
  ];

  readonly faqs: PricingFaq[] = [
    {
      question: 'Ce include Abonamentul Lunar?',
      answer: 'Abonamentul Lunar \u00ee\u021bi ofer\u0103 acces nelimitat la sesiunile casual din luna curent\u0103 \u015fi reduceri la toate evenimentele (Pauper, cEDH Showdown, Liga Lunar\u0103). Nu se transfer\u0103 \u00een luna urm\u0103toare.',
      open: false
    },
    {
      question: 'Trebuie s\u0103 am propriul deck pentru a veni?',
      answer: 'Nu neap\u0103rat! La sesiunile casual avem deck-uri disponibile pentru \u00eemprumut, mai ales pentru juc\u0103torii noi. Te rug\u0103m s\u0103 ne anun\u021bi \u00een avans prin WhatsApp sau Discord.',
      open: false
    },
    {
      question: 'Cum se pl\u0103tesc taxele de participare?',
      answer: 'Plata se face direct la loca\u021bie, \u00een numerar sau prin transfer bancar. Contact\u0103m pe WhatsApp sau Discord pentru detalii.',
      open: false
    },
    {
      question: 'Evenimentele speciale sunt incluse \u00een abonament?',
      answer: 'Evenimentele (Pauper, cEDH Showdown, Liga Lunar\u0103) au tax\u0103 separat\u0103 de participare, dar abona\u021bii beneficiaz\u0103 de pre\u021buri reduse fa\u021b\u0103 de tariful standard.',
      open: false
    }
  ];

  savingsPercent(fee: EventFee): string {
    const pct = Math.round((fee.standardPrice - fee.memberPrice) / fee.standardPrice * 100);
    return `-${pct}%`;
  }

  toggleFaq(faq: PricingFaq): void {
    faq.open = !faq.open;
  }
}
