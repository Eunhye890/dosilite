'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Reservation } from '@/lib/types';

interface State {
  selectedDate: Date;
  currentYear: number;
  currentMonth: number; // 0-indexed
  reservations: Reservation[];
  loading: boolean;
}

type Action =
  | { type: 'SET_DATE'; date: Date }
  | { type: 'SET_MONTH'; year: number; month: number }
  | { type: 'SET_RESERVATIONS'; reservations: Reservation[] }
  | { type: 'ADD_RESERVATION'; reservation: Reservation }
  | { type: 'UPDATE_RESERVATION'; reservation: Reservation }
  | { type: 'REMOVE_RESERVATION'; id: string }
  | { type: 'SET_LOADING'; loading: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_DATE':
      return { ...state, selectedDate: action.date };
    case 'SET_MONTH':
      return { ...state, currentYear: action.year, currentMonth: action.month };
    case 'SET_RESERVATIONS':
      return { ...state, reservations: action.reservations, loading: false };
    case 'ADD_RESERVATION':
      if (state.reservations.some(r => r.id === action.reservation.id)) {
        return state;
      }
      return { ...state, reservations: [...state.reservations, action.reservation] };
    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(r =>
          r.id === action.reservation.id ? action.reservation : r
        ),
      };
    case 'REMOVE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.filter(r => r.id !== action.id),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

const now = new Date();
const initialState: State = {
  selectedDate: now,
  currentYear: now.getFullYear(),
  currentMonth: now.getMonth(),
  reservations: [],
  loading: true,
};

const ReservationContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ReservationContext.Provider value={{ state, dispatch }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservationContext() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservationContext must be inside ReservationProvider');
  return ctx;
}
