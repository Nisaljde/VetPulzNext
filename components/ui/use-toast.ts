import { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, description, variant }: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
    const id = Date.now(); // Generate a unique ID for each toast
    setToasts((prev) => [...prev, { id, title, description, variant }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    toast: addToast,
    removeToast,
  };
}
