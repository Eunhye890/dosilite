'use client';

import { formatDate, isToday, isSameDay } from '@/lib/calendar';
import { useReservationContext } from '@/context/ReservationContext';

interface Props {
  date: Date;
  isCurrentMonth: boolean;
  hasReservation: boolean;
}

export default function CalendarCell({ date, isCurrentMonth, hasReservation }: Props) {
  const { state, dispatch } = useReservationContext();
  const selected = isSameDay(date, state.selectedDate);
  const today = isToday(date);

  return (
    <button
      type="button"
      onClick={() => {
        dispatch({ type: 'SET_DATE', date });
      }}
      className={`
        relative flex flex-col items-center justify-center
        min-h-[44px] min-w-[44px] p-1 rounded-lg
        touch-manipulation transition-colors
        ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-800'}
        ${selected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
        ${today && !selected ? 'ring-2 ring-blue-300' : ''}
      `}
    >
      <span className="text-sm font-medium">{date.getDate()}</span>
      {hasReservation && (
        <span
          className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
            selected ? 'bg-white' : 'bg-blue-500'
          }`}
        />
      )}
    </button>
  );
}
