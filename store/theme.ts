import { useState } from '#imports';

export const useThemeStore = () => {
  const isDarkMode = useState<boolean>('theme', () => false);

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    // Update dark mode class
    document.documentElement.classList.toggle('dark', isDarkMode.value);
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  };

  const initTheme = () => {
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      isDarkMode.value = savedTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDarkMode.value);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkMode.value = prefersDark;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  return {
    isDarkMode,
    toggleTheme,
    initTheme
  };
}; 