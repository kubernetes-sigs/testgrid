import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property } from 'lit/decorators.js';
import { TabSummaryInfo } from './testgrid-dashboard-summary.js';
import './testgrid-failures-summary.js';
import './testgrid-healthiness-summary.js';
import './testgrid-status-indicator.js';

@customElement('tab-summary')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TabSummary extends LitElement {
  @property({ type: Object })
  info?: TabSummaryInfo;

  render() {
    return html`
      <div class="tab">
        <div class="left">
          <testgrid-status-indicator status="${this.info?.overallStatus}"></testgrid-status-indicator>
        </div>
        <div class="mid">
          <div
            @click=${() => this.changeTab()}
            @keydown=${this.handleKeyDown}
            class="tab-name"
            tabindex="0"
            role="button"
            aria-label="Select tab ${this.info?.name}"
          >
            ${this.info?.name}: ${this.info?.overallStatus}
          </div>
          <div class="detailed-status">${this.info?.detailedStatusMsg}</div>
        </div>
        <div class="right">
          <div class="stats">
            <span class="stats-label">Updated:</span>
            <span class="stats-value">${this.info?.lastUpdateTimestamp}</span>
          </div>
          <div class="stats">
            <span class="stats-label">Tests last ran:</span>
            <span class="stats-value">${this.info?.lastRunTimestamp}</span>
          </div>
          <div class="stats">
            <span class="stats-label">Last green run:</span>
            <span class="stats-value">${this.info?.latestGreenBuild}</span>
          </div>
        </div>
      </div>
      ${this.info?.failuresSummary !== undefined
        ? html`<testgrid-failures-summary .info=${this.info}>
          </testgrid-failures-summary>`
        : ''}
      ${this.info?.healthinessSummary !== undefined
        ? html`<testgrid-healthiness-summary .info=${this.info}>
          </testgrid-healthiness-summary>`
        : ''}
    `;
  }

  /**
   * Handles keyboard events for accessibility
   */
  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.changeTab();
    }
  }

  /**
   * Lets the data content element know that the tab changed
   *
   * @fires tab-changed
   * @param tabName string
   */
  private changeTab() {
    window.dispatchEvent(
      new CustomEvent('tab-changed', {
        detail: {
          tabName: this.info?.name!,
        },
      })
    );
  }

  static styles = css`
    .tab {
      border: 1px solid #6b90da;
      border-radius: 6px;
      color: #000;
      display: grid;
      grid-template-columns: 40px 1fr auto;
      gap: 8px;
      margin: 5px;
      padding: 8px 12px;
      align-items: center;
    }

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .mid {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .tab-name {
      cursor: pointer;
      color: #1a0dab;
      text-decoration: underline;
      font-weight: 500;
      padding: 2px 0;
    }

    .tab-name:hover {
      color: #551a8b;
    }

    .tab-name:focus {
      outline: 2px solid #4285f4;
      outline-offset: 2px;
    }

    .detailed-status {
      font-size: 0.875em;
      color: #555;
      line-height: 1.4;
    }

    .right {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: right;
      white-space: nowrap;
      font-size: 0.875em;
      color: #666;
      padding-left: 16px;
    }

    .stats {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
    }

    .stats-label {
      color: #888;
    }

    .stats-value {
      color: #333;
      font-weight: 500;
    }
  `;
}
