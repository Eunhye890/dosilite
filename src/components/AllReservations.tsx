'use client';

import { useReservationContext } from '@/context/ReservationContext';
import { formatDate, formatTimeRange } from '@/lib/calendar';
import type { Reservation } from '@/lib/types';
import { useMemo } from 'react';

interface Props {
  onEdit: (reservation: Reservation) => void;
}

function getDday(dateStr: string): { label: string; color: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { label: 'D-Day', color: 'bg-red-500 text-white' };
  if (diff > 0) return { label: `D-${diff}`, color: 'bg-blue-100 text-blue-700' };
  return { label: `D+${Math.abs(diff)}`, color: 'bg-gray-200 text-gray-500' };
}

function formatMonthDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const dow = weekdays[d.getDay()];
  return `${month}.${String(day).padStart(2, '0')} (${dow})`;
}

export default function AllReservations({ onEdit }: Props) {
  const { state, dispatch } = useReservationContext();
  const { reservations, loading } = state;

  // 오늘 이후 예약만 날짜+시간순 정렬
  const upcoming = useMemo(() => {
    const todayStr = formatDate(new Date());
    return reservations
      .filter(r => r.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
  }, [reservations]);

  const handleDelete = async (reservation: Reservation) => {
    if (!confirm('이 예약을 삭제하시겠습니까?')) return;
    dispatch({ type: 'REMOVE_RESERVATION', id: reservation.id });
    try {
      const res = await fetch(`/api/reservations/${reservation.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
    } catch {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="text-base font-bold text-gray-800 mb-3">
        예정된 일정
      </h3>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">예정된 일정이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map(r => {
            const dday = getDday(r.date);
            return (
              <div key={r.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                <div className="flex items-start gap-3">
                  {/* D-day 배지 */}
                  <div className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold ${dday.color}`}>
                    {dday.label}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">
                      {formatMonthDay(r.date)} {formatTimeRange(r.start_time, r.end_time)}
                    </p>
                    <p className="text-base font-medium text-gray-800 mt-0.5 truncate">
                      {r.title}{r.created_by ? ` (${r.created_by})` : ''}
                    </p>
                    {r.memo && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.memo}</p>
                    )}
                  </div>

                  {/* 수정/삭제 */}
                  <div className="flex gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEdit(r)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-gray-200 touch-manipulation"
                      aria-label="수정"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r)}
                      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-red-100 touch-manipulation"
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
          })}
        </div>
      )}
    </div>
  );
}
