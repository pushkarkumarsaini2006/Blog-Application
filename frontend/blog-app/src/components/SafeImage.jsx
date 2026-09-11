import React, { useState, useRef, useEffect } from 'react';
import { LuImageOff } from 'react-icons/lu';
import { IMAGE_CONFIG, PERFORMANCE_CONFIG } from '../utils/config';
import { ImageLoader } from '../utils/imageLoader';

const SafeImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon = LuImageOff,
  fallbackClassName = '',
  loading = 'lazy',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  // Enhanced error handling with retry logic
  const handleError = async () => {
    if (retryCount < IMAGE_CONFIG.MAX_RETRIES) {
      // Try with image loader for better CORS handling
      try {
        const loadedUrl = await ImageLoader.loadImageWithFallback(src);
        if (loadedUrl && imgRef.current) {
          setRetryCount(prev => prev + 1);
          setCurrentSrc(loadedUrl);
          imgRef.current.src = loadedUrl;
          return;
        }
      } catch (error) {
        console.warn('ImageLoader failed:', error);
      }
      
      // Fallback to original retry logic with cache busting
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (imgRef.current) {
          const retryUrl = `${src}?t=${Date.now()}&retry=${retryCount}`; // Cache busting with retry count
          setCurrentSrc(retryUrl);
          imgRef.current.src = retryUrl;
        }
      }, IMAGE_CONFIG.RETRY_DELAY);
    } else {
      console.warn(`Image failed to load after ${IMAGE_CONFIG.MAX_RETRIES} attempts:`, src);
      setImageError(true);
      setImageLoaded(true);
    }
  };

  const handleLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // Reset states when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setRetryCount(0);
    setCurrentSrc(src);
  }, [src]);

  if (imageError || !src) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 ${className} ${fallbackClassName}`}
        role="img"
        aria-label={alt || 'Image failed to load'}
        {...props}
      >
        {React.createElement(fallbackIcon, { className: "text-gray-400 text-xl" })}
      </div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <div 
          className={`flex items-center justify-center bg-gray-100 animate-pulse ${className}`}
          role="img"
          aria-label="Loading image"
          {...props}
        >
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
        </div>
      )}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${className} ${!imageLoaded ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading={PERFORMANCE_CONFIG.LAZY_LOADING ? loading : 'eager'}
        decoding="async"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        {...props}
      />
    </>
  );
};

export default SafeImage;
