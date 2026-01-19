// NOWA Systems Theme Toggle (Dark/Light Mode)
class NOWATheme {
  constructor() {
    this.init();
  }

  init() {
    this.createToggleButton();
    this.applySavedTheme();
    this.addListeners();
  }

  createToggleButton() {
    // Create toggle button HTML
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle mr-4';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    toggleButton.innerHTML = `
      <span class="sr-only">Toggle theme</span>
      <svg class="sun-icon w-4 h-4 absolute left-1 top-0.5 text-yellow-400 opacity-100 dark:opacity-0 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
      </svg>
      <svg class="moon-icon w-4 h-4 absolute right-1 top-0.5 text-blue-400 opacity-0 dark:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
      </svg>
    `;

    // Insert before the Get Started button
    const nav = document.querySelector('nav .flex');
    if (nav) {
      const getStartedBtn = nav.querySelector('a[href="#"]');
      if (getStartedBtn) {
        nav.insertBefore(toggleButton, getStartedBtn);
      }
    }

    this.toggleButton = toggleButton;
  }

  applySavedTheme() {
    const savedTheme = localStorage.getItem('nowa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-mode');
    this.toggleButton.classList.add('active');
    localStorage.setItem('nowa-theme', 'dark');
  }

  disableDarkMode() {
    document.body.classList.remove('dark-mode');
    this.toggleButton.classList.remove('active');
    localStorage.setItem('nowa-theme', 'light');
  }

  toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  addListeners() {
    this.toggleButton.addEventListener('click', () => this.toggleTheme());
  }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new NOWATheme();
});