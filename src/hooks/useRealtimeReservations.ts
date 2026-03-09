'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useReservationContext } from '@/context/ReservationContext';
import type { Reservation } from '@/lib/types';

export function useRealtimeReservations() {
  const { dispatch } = useReservationContext();

  useEffect(() => {
    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              dispatch({
                type: 'ADD_RESERVATION',
                reservation: payload.new as Reservation,
              });
              break;
            case 'UPDATE':
              dispatch({
                type: 'UPDATE_RESERVATION',
                reservation: payload.new as Reservation,
              });
              break;
            case 'DELETE':
              dispatch({
                type: 'REMOVE_RESERVATION',
                id: (payload.old as { id: string }).id,
              });
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch]);
}
