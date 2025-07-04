import { getFullImageUrl } from './helper';

// Image preloader utility for Render deployment
export class ImageLoader {
  static cache = new Map();
  
  static async preloadImage(src) {
    if (!src) return null;
    
    // Check cache first
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }
    
    return new Promise((resolve) => {
      const img = new Image();
      
      const handleLoad = () => {
        this.cache.set(src, { status: 'loaded', url: src });
        resolve({ status: 'loaded', url: src });
      };
      
      const handleError = () => {
        this.cache.set(src, { status: 'error', url: src });
        resolve({ status: 'error', url: src });
      };
      
      img.onload = handleLoad;
      img.onerror = handleError;
      
      // Set crossOrigin before src for Render compatibility
      img.crossOrigin = 'anonymous';
      img.src = src;
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (!this.cache.has(src)) {
          handleError();
        }
      }, 10000);
    });
  }
  
  static async loadImageWithFallback(imagePath, fallbackPath = null) {
    if (!imagePath) return null;
    
    let primaryUrl = getFullImageUrl(imagePath);
    
    // Ensure HTTPS for onrender.com URLs
    if (primaryUrl.includes('onrender.com') && primaryUrl.startsWith('http://')) {
      primaryUrl = primaryUrl.replace('http://', 'https://');
    }
    const result = await this.preloadImage(primaryUrl);
    
    if (result.status === 'loaded') {
      return result.url;
    }
    
    // Try fallback if primary fails
    if (fallbackPath) {
      const fallbackUrl = getFullImageUrl(fallbackPath);
      // console.log('Trying fallback URL:', fallbackUrl); // Debug log
      const fallbackResult = await this.preloadImage(fallbackUrl);
      if (fallbackResult.status === 'loaded') {
        return fallbackResult.url;
      }
    }
    
    // console.log('All image loading attempts failed for:', imagePath); // Debug log
    return null;
  }
  
  static clearCache() {
    this.cache.clear();
  }
}

export default ImageLoader;
