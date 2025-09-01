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
            Last update: ${this.info?.lastUpdateTimestamp}
          </div>
          <div class="stats">
            Tests last ran: ${this.info?.lastRunTimestamp}
          </div>
          <div class="stats">
            Last green run: ${this.info?.latestGreenBuild}
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
     /* title/link in each Summary card */
    .tab-name {
      cursor: pointer;
      position: relative;
      padding: 4px 8px;
      color: #00c;
      text-decoration: underline;
    }

    .tab {
      border: 1px solid #6b90da;
      border-radius: 6px 6px 0 0;
      color: #000;
      display: grid;
      grid-template-columns: 1fr 17fr 6fr;
      margin-top: 5px;
      overflow: hidden;
      align-items: center;
    }

    /* title/link in each Summary card */
    .tab-name {
      cursor: pointer;
      position: relative;
      padding: 4px 8px;
      color: #00c;
      text-decoration: underline;
    }

    .stats {
      text-align: right;
    }

    .left {
      justify-content: center;
      text-align: center;
    }
  `;
}
