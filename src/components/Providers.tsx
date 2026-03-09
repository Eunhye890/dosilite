'use client';

import { ReservationProvider } from '@/context/ReservationContext';
import type { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return <ReservationProvider>{children}</ReservationProvider>;
}
