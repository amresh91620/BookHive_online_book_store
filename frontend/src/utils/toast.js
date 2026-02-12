import toast from "react-hot-toast";
import { toastOptions } from "../config/toastConfig";

// Enhanced toast functions
export const showToast = {
  success: (message) => toast.success(message, toastOptions.success),
  error: (message) => toast.error(message, toastOptions.error),
  loading: (message) => toast.loading(message, toastOptions.loading),
  info: (message) => toast(message),
  warning: (message) => toast(message),
  
  // Promise-based toast
  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Loading...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      {
        success: toastOptions.success,
        error: toastOptions.error,
        loading: toastOptions.loading,
      }
    );
  },
  
  // Dismiss specific toast
  dismiss: (toastId) => toast.dismiss(toastId),
  
  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),
};

export default showToast;
