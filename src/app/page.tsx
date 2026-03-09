'use client';

import Calendar from '@/components/Calendar';
import DayReservations from '@/components/DayReservations';
import Fab from '@/components/Fab';
import FormContainer from '@/components/FormContainer';
import { useReservations } from '@/hooks/useReservations';
import { useRealtimeReservations } from '@/hooks/useRealtimeReservations';
import { useState } from 'react';
import type { Reservation } from '@/lib/types';

export default function Home() {
  useReservations();
  useRealtimeReservations();

  const [formOpen, setFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const handleAdd = () => {
    setEditingReservation(null);
    setFormOpen(true);
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setFormOpen(true);
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditingReservation(null);
  };

  return (
    <main className="min-h-screen max-w-lg mx-auto px-4 py-6 pb-24">
      <Calendar />
      <div className="mt-4">
        <DayReservations onEdit={handleEdit} />
      </div>
      <Fab onClick={handleAdd} />
      {formOpen && (
        <FormContainer
          reservation={editingReservation}
          onClose={handleClose}
        />
      )}
    </main>
  );
}
