export type EventStatus = 'upcoming' | 'today' | 'full' | 'past';
export type EventFormat = 'Commander Casual' | 'Commander Competitiv' | 'Pauper' | 'Special Event';
export type EventType =
  | 'casual-commander'
  | 'board-game'
  | 'special-formats'
  | 'pauper'
  | 'pauper-prize'
  | 'cedh-showdown'
  | 'cedh-league'
  | 'open-market';

export interface MtgEvent {
  id: string;
  title: string;
  eventType: EventType;
  format: EventFormat;
  date: string;
  time: string;
  location: string;
  capacity: number;
  spotsLeft: number;
  status: EventStatus;
  imageUrl?: string;
  description?: string;
  feeStandard: number;
  feeMember: number;
  userRegistrationStatus?: 'pending' | 'confirmed' | 'cancelled' | null;
}

export const EVENT_TYPE_FORMAT_MAP: Record<EventType, EventFormat> = {
  'casual-commander': 'Commander Casual',
  'board-game':       'Special Event',
  'special-formats':  'Special Event',
  'pauper':           'Pauper',
  'pauper-prize':     'Pauper',
  'cedh-showdown':    'Commander Competitiv',
  'cedh-league':      'Commander Competitiv',
  'open-market':      'Special Event',
};

const MONTHS_RO = [
  'Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
  'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'
];

export function formatDateRo(isoDate: string): string {
  const [, m, d] = isoDate.split('-');
  return `${parseInt(d, 10)} ${MONTHS_RO[parseInt(m, 10) - 1]}`;
}
