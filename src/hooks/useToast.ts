/**
 * useToast Hook
 * Custom hook untuk manage toast notifications
 */

"use client";

import { useState, useCallback } from "react";
import type { ToastProps } from "@/components/ui/Toast";

interface ToastItem extends ToastProps {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (props: Omit<ToastProps, "id" | "onClose">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const toast: ToastItem = {
        ...props,
        id,
        onClose: () => removeToast(id),
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      if (props.duration !== 0) {
        setTimeout(() => {
          removeToast(id);
        }, props.duration || 3000);
      }

      return id;
    },
    [removeToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (title: string, message: string, duration?: number) => {
      return showToast({ variant: "success", title, message, duration });
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message: string, duration?: number) => {
      return showToast({ variant: "error", title, message, duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message: string, duration?: number) => {
      return showToast({ variant: "warning", title, message, duration });
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message: string, duration?: number) => {
      return showToast({ variant: "info", title, message, duration });
    },
    [showToast]
  );

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  };
}
