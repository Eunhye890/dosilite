'use client';

import { formatTimeRange } from '@/lib/calendar';
import type { Reservation } from '@/lib/types';
import { useReservationContext } from '@/context/ReservationContext';

interface Props {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
}

export default function ReservationCard({ reservation, onEdit }: Props) {
  const { dispatch } = useReservationContext();

  const handleDelete = async () => {
    if (!confirm('이 예약을 삭제하시겠습니까?')) return;

    dispatch({ type: 'REMOVE_RESERVATION', id: reservation.id });

    try {
      const res = await fetch(`/api/reservations/${reservation.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('삭제 실패');
    } catch {
      // 실패 시 페이지 새로고침으로 복구
      window.location.reload();
    }
  };

  return (
    <div className="border border-gray-100 rounded-xl p-3 bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-600">
            {formatTimeRange(reservation.start_time, reservation.end_time)}
          </p>
          <p className="text-base font-medium text-gray-800 mt-0.5 truncate">
            {reservation.title}
          </p>
          {reservation.memo && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{reservation.memo}</p>
          )}
          {reservation.created_by && (
            <p className="text-xs text-gray-400 mt-1">{reservation.created_by}</p>
          )}
        </div>
        <div className="flex gap-1 ml-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(reservation)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-200 touch-manipulation"
            aria-label="수정"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-red-100 touch-manipulation"
            aria-label="삭제"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
