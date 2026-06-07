'use client';

import * as React from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export function useToast() {
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const showToast = React.useCallback((props: ToastProps) => {
    setToast(props);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}

export function ToastContainer({ toast }: { toast: ToastProps | null }) {
  if (!toast) return null;

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-600'
      : toast.type === 'error'
      ? 'bg-red-600'
      : 'bg-blue-600';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg`}>
        {toast.message}
      </div>
    </div>
  );
}
