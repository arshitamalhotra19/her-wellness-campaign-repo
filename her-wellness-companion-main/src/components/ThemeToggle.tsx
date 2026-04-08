import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('detecther_theme') === 'dark' ||
      (!localStorage.getItem('detecther_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('detecther_theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="relative h-8 w-14 rounded-full bg-muted border border-border transition-colors hover:bg-accent"
      aria-label="Toggle theme"
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${
        dark ? 'left-7 gradient-primary' : 'left-1 bg-primary'
      }`}>
        {dark ? <Moon className="h-3.5 w-3.5 text-primary-foreground" /> : <Sun className="h-3.5 w-3.5 text-primary-foreground" />}
      </span>
    </button>
  );
}
