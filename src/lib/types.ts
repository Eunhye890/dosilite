export interface Reservation {
  id: string;
  date: string; // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM'
  end_time: string; // 'HH:MM'
  title: string;
  memo: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReservationInput {
  date: string;
  start_time: string;
  end_time: string;
  title: string;
  memo?: string;
  created_by?: string;
}
