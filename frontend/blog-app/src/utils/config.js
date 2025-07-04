// Accessibility and Error Handling Configuration

// Default image handling
export const IMAGE_CONFIG = {
  // Fallback images for different contexts
  FALLBACK_PROFILE: '/assets/default-profile.svg',
  FALLBACK_COVER: '/assets/default-cover.svg',
  
  // Image loading states
  LOADING_PLACEHOLDER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD4KICA8L3N2Zz4K',
  
  // Error retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Accessibility labels for common elements
export const ARIA_LABELS = {
  // Navigation
  MENU_OPEN: 'Open navigation menu',
  MENU_CLOSE: 'Close navigation menu',
  SEARCH_OPEN: 'Open search',
  SEARCH_BUTTON: 'Search posts',
  
  // Modal and drawer actions
  MODAL_CLOSE: 'Close modal',
  DRAWER_CLOSE: 'Close drawer',
  
  // Image actions
  UPLOAD_PHOTO: 'Upload profile photo',
  REMOVE_PHOTO: 'Remove profile photo',
  
  // Social actions
  LIKE_POST: 'Like this post',
  SHARE_POST: 'Share this post',
  COMMENT_REPLY: 'Reply to this comment',
  DELETE_COMMENT: 'Delete this comment',
  
  // Loading states
  LOADING: 'Loading content',
  RETRY: 'Retry loading',
};

// Performance optimization settings
export const PERFORMANCE_CONFIG = {
  // Image loading
  LAZY_LOADING: true,
  IMAGE_QUALITY: 85,
  WEBP_SUPPORT: true,
  
  // Animation preferences
  REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // Throttling and debouncing
  SEARCH_DEBOUNCE: 300,
  SCROLL_THROTTLE: 100,
};

// Error handling configuration
export const ERROR_CONFIG = {
  // Network errors
  NETWORK_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  
  // Image loading errors
  IMAGE_TIMEOUT: 10000,
  
  // API error messages
  DEFAULT_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
};

export default {
  IMAGE_CONFIG,
  ARIA_LABELS,
  PERFORMANCE_CONFIG,
  ERROR_CONFIG,
};
