import { useState, useEffect } from 'react';
import { checkBackendStatus, wakeBackend } from '../utils/axiosInstance';
import { FiServer, FiWifi, FiWifiOff, FiAlertCircle } from 'react-icons/fi';

const BackendStatusIndicator = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline', 'waking'
  const [showDetails, setShowDetails] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const checkStatus = async () => {
    try {
      const isHealthy = await checkBackendStatus();
      setStatus(isHealthy ? 'online' : 'offline');
      setLastCheck(new Date());
    } catch (error) {
      setStatus('offline');
      setLastCheck(new Date());
    }
  };

  const handleWakeBackend = async () => {
    setStatus('waking');
    try {
      await wakeBackend();
      setStatus('online');
    } catch (error) {
      setStatus('offline');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'waking': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return <FiWifi className="w-4 h-4" />;
      case 'offline': return <FiWifiOff className="w-4 h-4" />;
      case 'waking': return <FiServer className="w-4 h-4 animate-pulse" />;
      default: return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'waking': return 'Waking up...';
      default: return 'Checking...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div 
          className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className={`${getStatusColor()} flex items-center gap-2`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
        
        {showDetails && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="space-y-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last checked: {lastCheck ? lastCheck.toLocaleTimeString() : 'Never'}
              </div>
              
              {status === 'offline' && (
                <button
                  onClick={handleWakeBackend}
                  className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                >
                  Wake Backend
                </button>
              )}
              
              <button
                onClick={checkStatus}
                className="w-full px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
              >
                Check Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendStatusIndicator;
