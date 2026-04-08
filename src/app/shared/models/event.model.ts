export type EventStatus = 'upcoming' | 'today' | 'full' | 'past';
export type EventFormat = 'Commander Casual' | 'Commander Competitiv' | 'Pauper' | 'Special Event';

export interface MtgEvent {
  id: string;
  title: string;
  format: EventFormat;
  date: string;         // display string e.g. "12 Aprilie"
  time: string;
  location: string;
  capacity: number;
  spotsLeft: number;
  status: EventStatus;
  imageUrl?: string;    // event art / photo shown in the card frame
  description?: string;
}


