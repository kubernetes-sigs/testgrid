import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from './styles/shared-styles.js';

const STATUS_ICONS = new Map<string, string>([
  ['PASSING', 'check_circle'],        // Filled check for clear success
  ['FAILING', 'cancel'],              // X in circle for clear failure
  ['FLAKY', 'swap_horiz'],            // Horizontal swap arrows for instability
  ['STALE', 'schedule'],              // Clock for outdated
  ['BROKEN', 'error'],                // Exclamation in circle for broken
  ['PENDING', 'hourglass_empty'],     // Hourglass for waiting
  ['ACCEPTABLE', 'check_circle_outline'], // Outlined check for acceptable
]);

const STATUS_LABELS = new Map<string, string>([
  ['PASSING', 'All tests passing'],
  ['FAILING', 'Tests failing'],
  ['FLAKY', 'Tests are flaky (intermittent failures)'],
  ['STALE', 'Results are stale (outdated)'],
  ['BROKEN', 'Infrastructure or configuration broken'],
  ['PENDING', 'Tests pending or in progress'],
  ['ACCEPTABLE', 'Failures within acceptable threshold'],
]);

/**
 * Status indicator with distinct icon shapes and colors.
 * Icons are the primary differentiator (accessible to color-blind users).
 * Colors provide secondary reinforcement.
 *
 * Hover/focus shows tooltip with status description.
 */
@customElement('testgrid-status-indicator')
export class TestgridStatusIndicator extends LitElement {
  @property({ reflect: true })
  status: string = '';

  private get iconName(): string {
    return STATUS_ICONS.get(this.status) || 'help_outline';
  }

  private get statusLabel(): string {
    return STATUS_LABELS.get(this.status) || `Status: ${this.status}`;
  }

  render() {
    return html`
      <span
        class="indicator"
        role="img"
        aria-label=${this.statusLabel}
        title=${this.statusLabel}
        tabindex="0"
      >
        <i class="material-icons" aria-hidden="true">${this.iconName}</i>
      </span>
    `;
  }

  static styles = [sharedStyles, css`
    :host {
      display: inline-flex;
      align-items: center;
    }

    .indicator {
      display: inline-flex;
      align-items: center;
      cursor: default;
      border-radius: 4px;
    }

    .indicator:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    .material-icons {
      font-family: 'Material Icons';
      font-size: 1.5em;
      font-style: normal;
    }

    /* Status colors - using CSS custom properties from tokens.css */
    :host([status='PASSING']) { color: var(--status-pass); }
    :host([status='FAILING']) { color: var(--status-fail); }
    :host([status='FLAKY']) { color: var(--status-flaky); }
    :host([status='STALE']) { color: var(--status-stale); }
    :host([status='BROKEN']) { color: var(--status-broken); }
    :host([status='PENDING']) { color: var(--status-pending); }
    :host([status='ACCEPTABLE']) { color: var(--status-acceptable); }
  `];
}
