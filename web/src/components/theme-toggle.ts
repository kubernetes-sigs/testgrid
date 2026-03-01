import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared-styles.js';
import { Theme, setTheme, getStoredTheme } from '../contexts/theme-context.js';

/**
 * Theme toggle button with sun/moon icon.
 * Cycles through: system -> light -> dark -> system
 */
@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  @state() private theme: Theme = 'system';
  @state() private resolvedTheme: 'light' | 'dark' = 'light';

  private mediaQuery: MediaQueryList | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.theme = getStoredTheme();
    this.resolvedTheme = this.resolveTheme();

    // Listen for system preference changes
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener('change', this.handleSystemChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.mediaQuery?.removeEventListener('change', this.handleSystemChange);
  }

  private handleSystemChange = () => {
    if (this.theme === 'system') {
      this.resolvedTheme = setTheme('system');
    }
  };

  private resolveTheme(): 'light' | 'dark' {
    if (this.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.theme;
  }

  private toggle() {
    // Cycle: system -> light -> dark -> system
    const next: Theme = this.theme === 'system' ? 'light'
                      : this.theme === 'light' ? 'dark'
                      : 'system';

    this.theme = next;
    this.resolvedTheme = setTheme(next);
  }

  private get icon(): string {
    // Show what mode is currently active
    return this.resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  private get label(): string {
    const modeLabels: Record<Theme, string> = {
      system: 'Using system theme',
      light: 'Light mode',
      dark: 'Dark mode'
    };
    return modeLabels[this.theme];
  }

  render() {
    return html`
      <button
        @click=${this.toggle}
        aria-label=${this.label}
        title=${this.label}
        class="toggle-btn"
      >
        <span class="material-icons" aria-hidden="true">${this.icon}</span>
      </button>
    `;
  }

  static styles = [sharedStyles, css`
    :host {
      display: inline-flex;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: var(--tg-header-text, #fff);
      transition: background-color 0.2s;
    }

    .toggle-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .toggle-btn:focus-visible {
      outline: 2px solid var(--tg-primary);
      outline-offset: 2px;
    }

    .material-icons {
      font-family: 'Material Icons';
      font-size: 1.5rem;
    }
  `];
}
