// Environment validation utility
export const validateEnvironment = () => {
  const requiredEnvVars = ['VITE_BACKEND_URL'];
  const missing = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Using fallback values...');
  }
  
  const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    PROD: import.meta.env.PROD || false,
    DEV: import.meta.env.DEV || false,
  };
  
  console.log('Frontend Environment Config:', config);
  return config;
};

export default { validateEnvironment };
