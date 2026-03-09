'use client';

import { useReservationContext } from '@/context/ReservationContext';
import { formatDate, formatDateKorean } from '@/lib/calendar';
import type { Reservation } from '@/lib/types';
import ReservationCard from './ReservationCard';
import { useMemo } from 'react';

interface Props {
  onEdit: (reservation: Reservation) => void;
}

export default function DayReservations({ onEdit }: Props) {
  const { state } = useReservationContext();
  const { selectedDate, reservations, loading } = state;

  const dateStr = formatDate(selectedDate);

  const dayReservations = useMemo(
    () =>
      reservations
        .filter(r => r.date === dateStr)
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [reservations, dateStr]
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="text-base font-bold text-gray-800 mb-3">
        {formatDateKorean(selectedDate)} 예약 현황
      </h3>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
      ) : dayReservations.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">예약이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {dayReservations.map(r => (
            <ReservationCard key={r.id} reservation={r} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}
