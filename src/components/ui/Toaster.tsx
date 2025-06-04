import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export const toastStore = {
  toasts: [] as Toast[],
  listeners: new Set<() => void>(),
  
  getToasts() {
    return this.toasts;
  },
  
  addToast(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    this.toasts = [...this.toasts, { id, message, type }];
    this.notifyListeners();
    
    setTimeout(() => {
      this.removeToast(id);
    }, 5000);
    
    return id;
  },
  
  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  },
  
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  },
  
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastStore.getToasts());
  
  useEffect(() => {
    const unsubscribe = toastStore.subscribe(() => {
      setToasts(toastStore.getToasts());
    });
    return unsubscribe;
  }, []);
  
  return {
    toasts,
    toast: (message: string, type?: ToastType) => toastStore.addToast(message, type),
    dismiss: (id: string) => toastStore.removeToast(id)
  };
};

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getToastClasses = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'border-l-4 border-green-500 bg-green-50 text-green-700';
    case 'error':
      return 'border-l-4 border-red-500 bg-red-50 text-red-700';
    case 'info':
    default:
      return 'border-l-4 border-blue-500 bg-blue-50 text-blue-700';
  }
};

export const Toaster = () => {
  const { toasts, dismiss } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`max-w-md w-full flex items-start p-4 rounded-md shadow-lg ${getToastClasses(toast.type)}`}
          role="alert"
        >
          <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="ml-4 flex-shrink-0 inline-flex text-gray-400 focus:outline-none focus:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};