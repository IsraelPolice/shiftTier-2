export interface BreakSlot {
  id?: string;
  time: string;
  booked: boolean;
  user: string | null;
  note: string | null;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface AdminDashboardProps {
  breaks: BreakSlot[];
  currentDate: string;
  setBreaks: (breaks: BreakSlot[]) => void;
  setMessage: (message: string) => void;
}