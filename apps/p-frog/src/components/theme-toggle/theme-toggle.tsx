import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('p-frog-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('transitioning');
    html.classList.toggle('dark', isDark);
    localStorage.setItem('p-frog-theme', isDark ? 'dark' : 'light');
    const timer = setTimeout(() => html.classList.remove('transitioning'), 350);
    return () => clearTimeout(timer);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle dark mode"
      className="flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200"
      style={{
        width: 34,
        height: 34,
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface-warm)',
        color: 'var(--color-text-secondary)',
      }}
    >
      <FontAwesomeIcon
        icon={isDark ? faMoon : faSun}
        className="text-[15px] transition-transform duration-400"
        style={{ transform: isDark ? 'rotate(180deg)' : 'none' }}
      />
    </button>
  );
}

export default ThemeToggle;
