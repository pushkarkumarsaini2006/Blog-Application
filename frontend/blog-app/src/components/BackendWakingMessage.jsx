import React from 'react';
import { LuLoaderCircle } from 'react-icons/lu';

const BackendWakingMessage = ({ show, onRetry }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <LuLoaderCircle className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Backend is Starting Up
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The backend service is waking up from sleep. This usually takes 30-60 seconds on free hosting.
        </p>
        
        <div className="flex items-center justify-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default BackendWakingMessage;
