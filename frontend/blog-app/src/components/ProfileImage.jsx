import React, { useState } from 'react';
import { LuUser } from 'react-icons/lu';

const ProfileImage = ({ 
  src, 
  alt = "Profile picture", 
  size = "w-11 h-11", 
  fallbackIcon: FallbackIcon = LuUser 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Construct the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, use it
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Build the full URL using the backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${backendUrl}${cleanPath}`;
  };

  const imageUrl = getImageUrl(src);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // If no src or image failed to load, show fallback
  if (!imageUrl || imageError) {
    return (
      <div className={`${size} bg-gray-200 rounded-full flex items-center justify-center`}>
        <FallbackIcon className="text-gray-500 text-lg" />
      </div>
    );
  }

  return (
    <div className={`${size} relative`}>
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className={`${size} bg-gray-200 rounded-full animate-pulse absolute inset-0`} />
      )}
      
      {/* Actual image */}
      <img
        src={imageUrl}
        alt={alt}
        className={`${size} rounded-full object-cover ${!imageLoaded ? 'invisible' : ''}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};

export default ProfileImage;
