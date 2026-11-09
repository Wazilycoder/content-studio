"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastType = "success" | "error" | "info" | "default";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (title: string, options?: { type?: ToastType; description?: string; duration?: number }) => void;
  success: (title: string, options?: { description?: string; duration?: number }) => void;
  error: (title: string, options?: { description?: string; duration?: number }) => void;
  info: (title: string, options?: { description?: string; duration?: number }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, options?: { type?: ToastType; description?: string; duration?: number }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = {
        id,
        title,
        description: options?.description,
        type: options?.type || "default",
        duration: options?.duration || 4000,
      };

      console.log("[SonnerToast] addToast called:", newToast);
      setToasts((prev) => {
        const next = [newToast, ...prev].slice(0, 5);
        console.log("[SonnerToast] setToasts returning:", next);
        return next;
      });

      setTimeout(() => {
        dismiss(id);
      }, newToast.duration);
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, options?: { description?: string; duration?: number }) => {
      addToast(title, { ...options, type: "success" });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, options?: { description?: string; duration?: number }) => {
      addToast(title, { ...options, type: "error" });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, options?: { description?: string; duration?: number }) => {
      addToast(title, { ...options, type: "info" });
    },
    [addToast]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__toast = { toast: addToast, success, error, info };
    }
  }, [addToast, success, error, info]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, dismiss }}>
      {children}
      {/* Emil Kowalski Stacked Toast Viewport */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none w-full max-w-sm"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="relative w-full flex flex-col items-end pointer-events-auto">
          {toasts.map((item, index) => {
            const isFront = index === 0;
            const offset = index * 12;
            const scale = 1 - index * 0.04;
            const opacity = index > 2 ? 0 : 1 - index * 0.15;

            return (
              <div
                key={item.id}
                style={{
                  transform: isExpanded
                    ? `translateY(-${index * 68}px) scale(1)`
                    : `translateY(-${offset}px) scale(${scale})`,
                  opacity,
                  zIndex: 50 - index,
                  transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className={cn(
                  "absolute bottom-0 right-0 w-full rounded-2xl p-4 shadow-xl backdrop-blur-xl border flex items-start gap-3",
                  "bg-[var(--surface)]/95 text-[var(--ink-primary)] border-[var(--border-hairline)]",
                  item.type === "success" && "border-emerald-500/30 dark:border-emerald-500/40",
                  item.type === "error" && "border-rose-500/30 dark:border-rose-500/40",
                  item.type === "info" && "border-sky-500/30 dark:border-sky-500/40"
                )}
              >
                {/* Status Indicator Icon */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    item.type === "success" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
                    item.type === "error" && "bg-rose-500/15 text-rose-600 dark:text-rose-400",
                    item.type === "info" && "bg-sky-500/15 text-sky-600 dark:text-sky-400",
                    item.type === "default" && "bg-[var(--ink-secondary)]/10 text-[var(--ink-primary)]"
                  )}
                >
                  {item.type === "success" && <Check className="w-4 h-4" />}
                  {item.type === "error" && <AlertCircle className="w-4 h-4" />}
                  {item.type === "info" && <Info className="w-4 h-4" />}
                  {item.type === "default" && <Info className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs font-semibold tracking-tight">{item.title}</p>
                  {item.description && (
                    <p className="text-[11px] text-[var(--ink-secondary)] mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => dismiss(item.id)}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[var(--ink-tertiary)] hover:text-[var(--ink-primary)] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
