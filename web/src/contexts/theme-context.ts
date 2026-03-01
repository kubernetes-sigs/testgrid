import { createContext } from '@lit/context';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
}

export const themeContext = createContext<ThemeState>('testgrid-theme-context');

export const defaultThemeState: ThemeState = {
  theme: 'system',
  resolvedTheme: 'light'
};

/**
 * Initialize theme on page load. Call inline in <head> to prevent FOUC.
 * Returns the resolved theme for initial state.
 */
export function initializeTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme') as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let resolved: 'light' | 'dark';
  if (stored === 'dark') {
    resolved = 'dark';
  } else if (stored === 'light') {
    resolved = 'light';
  } else {
    // 'system' or null
    resolved = prefersDark ? 'dark' : 'light';
  }

  document.documentElement.classList.toggle('dark', resolved === 'dark');
  return resolved;
}

/**
 * Set theme and update DOM. Returns the new resolved theme.
 */
export function setTheme(theme: Theme): 'light' | 'dark' {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let resolved: 'light' | 'dark';
  if (theme === 'system') {
    localStorage.removeItem('theme');
    resolved = prefersDark ? 'dark' : 'light';
  } else {
    localStorage.setItem('theme', theme);
    resolved = theme;
  }

  document.documentElement.classList.toggle('dark', resolved === 'dark');
  return resolved;
}

/**
 * Get current theme from localStorage or default to 'system'.
 */
export function getStoredTheme(): Theme {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return 'system';
}
