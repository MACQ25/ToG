import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemesService {
    isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    // Automatically apply class changes whenever the signal updates
    effect(() => {
      const root = document.documentElement;
      if (this.isDarkMode()) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    
    // Fallback to system preference if no user preference is stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
