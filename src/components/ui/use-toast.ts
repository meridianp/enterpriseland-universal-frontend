import { useState, useEffect } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, action, variant = 'default' }: Omit<ToastProps, 'id'>) => {
    const id = String(toastId++);
    const newToast: ToastProps = { id, title, description, action, variant };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, 5000);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

  return {
    toast,
    dismiss,
    toasts,
  };
}