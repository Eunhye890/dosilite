'use client';

import { useState } from 'react';
import { useReservationContext } from '@/context/ReservationContext';
import { formatDate } from '@/lib/calendar';
import type { Reservation, ReservationInput } from '@/lib/types';

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function ReservationForm({ reservation, onClose }: Props) {
  const { state, dispatch } = useReservationContext();
  const isEdit = !!reservation;

  const [form, setForm] = useState<ReservationInput>({
    date: reservation?.date ?? formatDate(state.selectedDate),
    start_time: reservation?.start_time ?? '09:00',
    end_time: reservation?.end_time ?? '10:00',
    title: reservation?.title ?? '',
    memo: reservation?.memo ?? '',
    created_by: reservation?.created_by ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof ReservationInput, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (form.start_time >= form.end_time) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        const res = await fetch(`/api/reservations/${reservation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('수정 실패');
        const updated = await res.json();
        dispatch({ type: 'UPDATE_RESERVATION', reservation: updated });
      } else {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('등록 실패');
        const created = await res.json();
        dispatch({ type: 'ADD_RESERVATION', reservation: created });
      }
      onClose();
    } catch (err) {
      alert(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">
        {isEdit ? '예약 수정' : '예약 추가'}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">날짜</label>
        <input
          type="date"
          value={form.date}
          onChange={e => handleChange('date', e.target.value)}
          className="w-full text-base p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">시작 시간</label>
          <input
            type="time"
            value={form.start_time}
            onChange={e => handleChange('start_time', e.target.value)}
            className="w-full text-base p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">종료 시간</label>
          <input
            type="time"
            value={form.end_time}
            onChange={e => handleChange('end_time', e.target.value)}
            className="w-full text-base p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">예약자</label>
        <input
          type="text"
          value={form.title}
          onChange={e => handleChange('title', e.target.value)}
          placeholder="예약자 이름"
          className="w-full text-base p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">예약 내용</label>
        <input
          type="text"
          value={form.memo}
          onChange={e => handleChange('memo', e.target.value)}
          placeholder="개인업무, 회의, 클래스 등"
          className="w-full text-base p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">메모/특이사항</label>
        <textarea
          value={form.created_by}
          onChange={e => handleChange('created_by', e.target.value)}
          placeholder="특이사항이 있으면 입력"
          rows={2}
          className="w-full text-base p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 touch-manipulation"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 touch-manipulation"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}
