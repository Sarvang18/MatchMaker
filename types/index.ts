export type ClientStatus =
  | 'ONBOARDED'
  | 'ACTIVE'
  | 'MATCH_SENT'
  | 'MUTUAL_INTEREST'
  | 'MEETING_SCHEDULED'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type Gender = 'MALE' | 'FEMALE';

export interface ClientSummary {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  city: string;
  gender: Gender;
  religion: string;
  status: ClientStatus;
  photoUrl: string | null;
}

export interface MatchmakerSession {
  id: string;
  name: string;
  email: string;
  role: string;
}
