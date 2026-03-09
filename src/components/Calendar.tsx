'use client';

import { getMonthDays, formatDate, WEEKDAYS } from '@/lib/calendar';
import { useReservationContext } from '@/context/ReservationContext';
import CalendarCell from './CalendarCell';
import { useMemo } from 'react';

export default function Calendar() {
  const { state, dispatch } = useReservationContext();
  const { currentYear, currentMonth, reservations } = state;

  const weeks = useMemo(
    () => getMonthDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  // 예약이 있는 날짜 Set
  const reservedDates = useMemo(() => {
    const set = new Set<string>();
    reservations.forEach(r => set.add(r.date));
    return set;
  }, [reservations]);

  const goToPrevMonth = () => {
    const prev = currentMonth === 0
      ? { year: currentYear - 1, month: 11 }
      : { year: currentYear, month: currentMonth - 1 };
    dispatch({ type: 'SET_MONTH', ...prev });
  };

  const goToNextMonth = () => {
    const next = currentMonth === 11
      ? { year: currentYear + 1, month: 0 }
      : { year: currentYear, month: currentMonth + 1 };
    dispatch({ type: 'SET_MONTH', ...next });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-gray-800">
          {currentYear}.{String(currentMonth + 1).padStart(2, '0')}
        </h2>
        <button
          type="button"
          onClick={goToNextMonth}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-0.5">
        {weeks.map((week, wi) =>
          week.map((date, di) => {
            if (!date) return <div key={`${wi}-${di}`} />;
            const isCurrentMonth = date.getMonth() === currentMonth;
            const dateStr = formatDate(date);
            return (
              <CalendarCell
                key={dateStr}
                date={date}
                isCurrentMonth={isCurrentMonth}
                hasReservation={reservedDates.has(dateStr)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
