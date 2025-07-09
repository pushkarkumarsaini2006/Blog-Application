import { useState, useCallback } from 'react';
import { handleError } from '../utils/errorHandler';

export const useApiCall = (apiFunction, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorInfo = handleError(err, {
        showToast: options.showToast !== false,
        customMessage: options.customMessage,
        onRetry: options.onRetry,
        silent: options.silent
      });
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
};

export default useApiCall;
