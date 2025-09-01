import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from './styles/shared-styles.js';

const STATUS_ICONS = new Map<string, string>([
  ['PASSING', 'done'],
  ['FAILING', 'warning'],
  ['FLAKY', 'remove_circle_outline'],
  ['STALE', 'error_outline'],
  ['BROKEN', 'broken_image'],
  ['PENDING', 'schedule'],
  ['ACCEPTABLE', 'add_circle_outline'],
]);

@customElement('testgrid-status-indicator')
export class TestgridStatusIndicator extends LitElement {
  @property({ reflect: true })
  status: string = '';

  private get iconName(): string {
    return STATUS_ICONS.get(this.status) || 'help_outline';
  }

  render() {
    return html`
      <i class="material-icons" aria-label="Status: ${this.status}">${this.iconName}</i>
    `;
  }

  static styles = [sharedStyles, css`
    :host {
      display: inline-flex;
      align-items: center;
    }

    .material-icons {
      font-family: 'Material Icons';
      font-size: 1.5em;
      font-style: normal;
    }

    :host([status='PASSING']) { color: var(--tg-status-pass); }
    :host([status='FAILING']) { color: var(--tg-status-fail); }
    :host([status='FLAKY']) { color: var(--tg-status-flaky); }
    :host([status='STALE']) { color: var(--tg-status-stale); }
    :host([status='BROKEN']) { color: var(--tg-status-broken); }
    :host([status='PENDING']) { color: var(--tg-status-pending); }
    :host([status='ACCEPTABLE']) { color: var(--tg-status-acceptable); }
  `];
}