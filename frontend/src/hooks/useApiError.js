import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for consistent API error handling
 * @returns {Object} - Object with handleError function
 */
export function useApiError() {
  const handleError = useCallback((error, customMessage) => {
    const message = 
      error?.response?.data?.msg || 
      error?.response?.data?.error || 
      error?.message || 
      customMessage || 
      'Something went wrong';
    
    toast.error(message);
    
    // Log to error tracking service in production
    if (import.meta.env.PROD) {
      // TODO: Add Sentry or similar error tracking
      // Sentry.captureException(error);
    }
    
    return message;
  }, []);

  return { handleError };
}
