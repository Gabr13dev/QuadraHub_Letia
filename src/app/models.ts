export interface Court {
  name: string;
  type: string;
  hourlyRate: number;
  color: string;
  active: boolean;
  open: string;
  close: string;
}

export interface Booking {
  court: number;
  date?: string;
  start: number;
  end: number;
  name: string;
  paid: boolean;
  recurring: boolean;
}

export interface MonthlyMember {
  name: string;
  court: number;
  weekday: number;
  start: number;
  end: number;
  active: boolean;
}

export type AppView = 'overview' | 'agenda' | 'courts' | 'monthly';
export type ModalType = 'booking' | 'details' | 'court' | null;
