import toast from "react-hot-toast";

// Error types
const ERROR_TYPES = {
  NETWORK: 'network',
  BACKEND_SLEEPING: 'backend_sleeping',
  CORS: 'cors',
  TIMEOUT: 'timeout',
  SERVER: 'server',
  CLIENT: 'client',
  UNKNOWN: 'unknown'
};

// Analyze error to determine type
const analyzeError = (error) => {
  if (!error) return { type: ERROR_TYPES.UNKNOWN, message: 'Unknown error occurred' };

  // Network errors
  if (error.code === 'ERR_NETWORK') {
    return {
      type: ERROR_TYPES.NETWORK,
      message: 'Network connection failed. Please check your internet connection.'
    };
  }

  // CORS errors (often indicates backend is sleeping)
  if (error.message && error.message.includes('CORS')) {
    return {
      type: ERROR_TYPES.CORS,
      message: 'Backend service is starting up. Please wait a moment...'
    };
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.code === 'TIMEOUT') {
    return {
      type: ERROR_TYPES.TIMEOUT,
      message: 'Request timed out. The server might be sleeping.'
    };
  }

  // Server errors
  if (error.response) {
    const status = error.response.status;
    
    if (status === 502 || status === 503 || status === 504) {
      return {
        type: ERROR_TYPES.BACKEND_SLEEPING,
        message: 'Backend service is starting up. Please wait a moment...'
      };
    }
    
    if (status >= 500) {
      return {
        type: ERROR_TYPES.SERVER,
        message: error.response.data?.message || 'Server error occurred'
      };
    }
    
    if (status >= 400) {
      return {
        type: ERROR_TYPES.CLIENT,
        message: error.response.data?.message || 'Request failed'
      };
    }
  }

  return {
    type: ERROR_TYPES.UNKNOWN,
    message: error.message || 'An unexpected error occurred'
  };
};

// Handle errors with appropriate user feedback
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    customMessage = null,
    onRetry = null,
    silent = false
  } = options;

  const errorInfo = analyzeError(error);
  const message = customMessage || errorInfo.message;

  if (!silent) {
    console.error('Error details:', {
      type: errorInfo.type,
      message: message,
      originalError: error
    });
  }

  if (showToast) {
    switch (errorInfo.type) {
      case ERROR_TYPES.BACKEND_SLEEPING:
      case ERROR_TYPES.CORS:
        toast.loading(message, {
          duration: 3000,
          id: 'backend-waking'
        });
        break;
      
      case ERROR_TYPES.NETWORK:
      case ERROR_TYPES.TIMEOUT:
        toast.error(message, {
          duration: 4000,
          action: onRetry ? {
            label: 'Retry',
            onClick: onRetry
          } : undefined
        });
        break;
      
      case ERROR_TYPES.SERVER:
        toast.error(message, { duration: 4000 });
        break;
      
      case ERROR_TYPES.CLIENT:
        toast.error(message, { duration: 3000 });
        break;
      
      default:
        toast.error(message, { duration: 3000 });
    }
  }

  return errorInfo;
};

// Create a wrapper for API calls with error handling
export const withErrorHandling = (apiCall, options = {}) => {
  return async (...args) => {
    try {
      const result = await apiCall(...args);
      // Dismiss any pending backend loading toasts on success
      toast.dismiss('backend-waking');
      return result;
    } catch (error) {
      handleError(error, options);
      throw error;
    }
  };
};

export { ERROR_TYPES };
