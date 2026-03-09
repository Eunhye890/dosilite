'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { Reservation } from '@/lib/types';
import BottomSheet from './BottomSheet';
import Modal from './Modal';
import ReservationForm from './ReservationForm';

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function FormContainer({ reservation, onClose }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const form = <ReservationForm reservation={reservation} onClose={onClose} />;

  if (isDesktop) {
    return <Modal onClose={onClose}>{form}</Modal>;
  }

  return <BottomSheet onClose={onClose}>{form}</BottomSheet>;
}
