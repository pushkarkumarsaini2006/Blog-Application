import { useState, useEffect } from "react";

export const getInitials = (title) => {
  if (!title) return "";

  const words = title.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getToastMessagesByType = (type) => {
  switch (type) {
    case "edit":
      return "Blog post updated successfully!";
    case "draft":
      return "Blog post saved as draft successfully!";
    case "published":
      return "Blog post published successfully!";

    default:
      return "Blog post published successfully!";
  }
};

export const sanitizeMarkdown = (content) => {
  const markdownBlockRegex = /^```(?:markdown)?\n([\s\S]*?)\n```$/;
  const match = content.match(markdownBlockRegex);
  return match ? match[1] : content;
};

// Helper to get full image URL with error handling for Render deployment
export function getFullImageUrl(path) {
  if (!path) return IMAGE_CONFIG.FALLBACK_PROFILE;
  
  // Handle external URLs
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Always force HTTPS for onrender.com URLs for security
    if (path.includes('onrender.com')) {
      return path.replace('http://', 'https://');
    }
    return path;
  }
  
  // Handle relative paths - construct full URL
  let baseUrl = import.meta.env.VITE_BACKEND_URL || '';
  
  // For production, use the backend URL from env or fallback to localhost
  if (!baseUrl && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Development fallback
      baseUrl = 'http://localhost:5000';
    } else {
      // Generic fallback - force HTTPS for production
      const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
      baseUrl = `${protocol}://${window.location.hostname}:5000`;
    }
  }
  
  // Ensure baseUrl uses HTTPS in production
  if (baseUrl && baseUrl.includes('onrender.com') && baseUrl.startsWith('http://')) {
    baseUrl = baseUrl.replace('http://', 'https://');
  }
  
  // Handle both relative and absolute paths properly
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullPath = `${baseUrl}${cleanPath}`;
  
  return fullPath;
}

// Helper to check if image exists
export async function checkImageExists(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit'
    });
    return response.ok;
  } catch (error) {
    console.warn('Image check failed:', error);
    return false;
  }
}

export function useGreeting() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };

  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return greeting;
}