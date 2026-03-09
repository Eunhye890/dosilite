'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export default function BottomSheet({ children, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 열릴 때 애니메이션
    requestAnimationFrame(() => {
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)';
      }
    });
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end"
      onClick={handleBackdropClick}
    >
      <div
        ref={sheetRef}
        className="w-full rounded-t-2xl bg-white p-6 pb-8 max-h-[90vh] overflow-y-auto transition-transform duration-300 ease-out"
        style={{ transform: 'translateY(100%)' }}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
