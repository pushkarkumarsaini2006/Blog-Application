// Environment validation utility
export const validateEnvironment = () => {
  const requiredEnvVars = ['VITE_BACKEND_URL'];
  const missing = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Using fallback values...');
  }
  
  const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'https://blog-application-54yd.onrender.com',
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    PROD: import.meta.env.PROD || false,
    DEV: import.meta.env.DEV || false,
  };
  
  console.log('Frontend Environment Config:', config);
  return config;
};

// Check if backend is reachable
export const checkBackendConnectivity = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://blog-application-54yd.onrender.com'}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend connectivity check:', data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Backend connectivity check failed:', error);
    return false;
  }
};

export default { validateEnvironment, checkBackendConnectivity };
