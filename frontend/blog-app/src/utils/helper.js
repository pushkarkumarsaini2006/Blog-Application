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

// Helper to get full image URL
export function getFullImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    // Always force HTTPS for onrender.com URLs
    if (path.includes('onrender.com')) {
      return path.replace('http://', 'https://');
    }
    return path;
  }
  return `${import.meta.env.VITE_BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
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