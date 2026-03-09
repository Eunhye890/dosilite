'use client';

import { useEffect } from 'react';
import { useReservationContext } from '@/context/ReservationContext';

export function useReservations() {
  const { state, dispatch } = useReservationContext();
  const { currentYear, currentMonth } = state;

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: 'SET_LOADING', loading: true });

    // API에서 month는 1-indexed
    const month = currentMonth + 1;

    fetch(`/api/reservations?year=${currentYear}&month=${month}`)
      .then(res => {
        if (!res.ok) throw new Error('예약 조회 실패');
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          dispatch({ type: 'SET_RESERVATIONS', reservations: data });
        }
      })
      .catch(err => {
        console.error('예약 조회 오류:', err);
        if (!cancelled) {
          dispatch({ type: 'SET_RESERVATIONS', reservations: [] });
        }
      });

    return () => { cancelled = true; };
  }, [currentYear, currentMonth, dispatch]);
}
