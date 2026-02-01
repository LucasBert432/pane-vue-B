import { useToastStore } from "@/store/useToastStore";
import type { ToastType } from "@/store/useToastStore";

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function useToast() {
  const toastStore = useToastStore();

  const toast = (options: ToastOptions): number => {
    return toastStore.showToast({
      type: options.type || "info",
      title: options.title,
      message: options.message,
      duration: options.duration,
    });
  };

  const success = (
    title: string,
    message?: string,
    duration?: number,
  ): number => {
    return toastStore.success(title, message, duration);
  };

  const error = (
    title: string,
    message?: string,
    duration?: number,
  ): number => {
    return toastStore.error(title, message, duration);
  };

  const warning = (
    title: string,
    message?: string,
    duration?: number,
  ): number => {
    return toastStore.warning(title, message, duration);
  };

  const info = (title: string, message?: string, duration?: number): number => {
    return toastStore.info(title, message, duration);
  };

  const dismiss = (id: number): void => {
    toastStore.removeToast(id);
  };

  const clear = (): void => {
    toastStore.clearToasts();
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
    clear,
  };
}
