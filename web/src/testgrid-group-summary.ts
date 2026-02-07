import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import {
  ListDashboardSummariesResponse,
  DashboardSummary,
} from './gen/pb/api/v1/data.js';
import { APIController } from './controllers/api-controller.js';
import { apiClient } from './APIClient.js';
import { sharedStyles } from './styles/shared-styles.js';
import { navigateWithContext } from './utils/navigation.js';
import './testgrid-status-indicator.js';
import '@material/web/labs/card/outlined-card.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/ripple/ripple.js';
import '@material/web/divider/divider.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/assist-chip.js';

const STATUS_COLOR_MAP: Record<string, string> = {
  PASSING: 'var(--tg-status-pass)',
  FAILING: 'var(--tg-status-fail)',
  FLAKY: 'var(--tg-status-flaky)',
  STALE: 'var(--tg-status-stale)',
  BROKEN: 'var(--tg-status-broken)',
  PENDING: 'var(--tg-status-pending)',
  ACCEPTABLE: 'var(--tg-status-acceptable)',
  UNKNOWN: 'var(--tg-status-unknown)',
};

const SORTED_STATUSES = [
  'PASSING',
  'ACCEPTABLE',
  'FLAKY',
  'FAILING',
  'STALE',
  'BROKEN',
  'PENDING',
  'UNKNOWN',
] as const;

interface StatusBreakdown {
  status: string;
  count: number;
  color: string;
}

interface RenderedDashboardSummary {
  name: string;
  overallStatus: string;
  totalTabs: number;
  passingTabs: number;
  statusBreakdown: StatusBreakdown[];
}

interface OverallSummary {
  totalPassing: number;
  totalTabs: number;
  totalDashboards: number;
  statusAggregates: StatusBreakdown[];
}

function renderStatusBar(breakdown: StatusBreakdown[], total: number) {
  if (total === 0) {
    return html`<div class="status-bar"></div>`;
  }
  return html`
    <div class="status-bar">
      ${map(
        breakdown,
        s => html`
          <div
            class="status-bar-segment"
            style="width: ${(s.count / total) * 100}%; background: ${s.color};"
            title="${s.count} ${s.status}"
          ></div>
        `
      )}
    </div>
  `;
}

@customElement('testgrid-group-summary')
export class TestgridGroupSummary extends LitElement {
  @property({ type: String })
  groupName = '';

  @state()
  dashboardSummaries: RenderedDashboardSummary[] = [];

  @state()
  overallSummary: OverallSummary = {
    totalPassing: 0,
    totalTabs: 0,
    totalDashboards: 0,
    statusAggregates: [],
  };

  @state()
  isLoading = true;

  private dashboardSummariesController =
    new APIController<ListDashboardSummariesResponse>(this);

  render() {
    if (this.isLoading) {
      return html`
        <div class="container">
          <div class="loading">
            <md-linear-progress indeterminate></md-linear-progress>
          </div>
        </div>
      `;
    }

    if (this.dashboardSummaries.length === 0) {
      return html`
        <div class="container">
          <div class="page-header">
            <h1>${this.groupName}</h1>
            <p class="subtitle">Dashboard Group Overview</p>
          </div>
          <div class="empty-state">No dashboards found in this group.</div>
        </div>
      `;
    }

    return html`
      <div class="container">
        <div class="page-header">
          <h1>${this.groupName}</h1>
          <p class="subtitle">Dashboard Group Overview</p>
        </div>

        <md-outlined-card class="hero-card">
          <div class="hero-content">
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-value passing"
                  >${this.overallSummary.totalPassing}</span
                >
                <span class="stat-label">Passing</span>
              </div>
              <span class="stat-divider">/</span>
              <div class="stat">
                <span class="stat-value">${this.overallSummary.totalTabs}</span>
                <span class="stat-label">Total Tabs</span>
              </div>
              <div class="stat stat-dashboards">
                <span class="stat-value"
                  >${this.overallSummary.totalDashboards}</span
                >
                <span class="stat-label">Dashboards</span>
              </div>
            </div>

            ${renderStatusBar(
              this.overallSummary.statusAggregates,
              this.overallSummary.totalTabs
            )}
            ${this.overallSummary.statusAggregates.length > 0
              ? html`
                  <md-chip-set class="hero-chips">
                    ${map(
                      this.overallSummary.statusAggregates,
                      agg => html`
                        <md-assist-chip
                          label="${agg.count} ${agg.status}"
                          style="--md-assist-chip-label-text-color: ${agg.color}; --md-assist-chip-outline-color: ${agg.color};"
                        ></md-assist-chip>
                      `
                    )}
                  </md-chip-set>
                `
              : nothing}
          </div>
        </md-outlined-card>

        <div class="card-grid">
          ${map(
            this.dashboardSummaries,
            ds => html`
              <md-outlined-card
                class="dashboard-card"
                style="--card-status-color: ${STATUS_COLOR_MAP[
                  ds.overallStatus
                ] || 'var(--tg-status-unknown)'}"
                @click=${(e: Event) => this.handleDashboardClick(e, ds.name)}
                @keydown=${(e: KeyboardEvent) =>
                  this.handleCardKeydown(e, ds.name)}
                tabindex="0"
                role="button"
                aria-label="Navigate to dashboard ${ds.name}"
              >
                <md-ripple></md-ripple>
                <div class="card-content">
                  <div class="card-header">
                    <testgrid-status-indicator
                      status="${ds.overallStatus}"
                    ></testgrid-status-indicator>
                    <span class="card-title">${ds.name}</span>
                  </div>
                  <div class="card-progress-label">
                    ${ds.passingTabs}/${ds.totalTabs} passing
                  </div>
                  ${renderStatusBar(ds.statusBreakdown, ds.totalTabs)}
                  ${ds.statusBreakdown.some(s => s.status !== 'PASSING')
                    ? html`
                        <div class="card-chips">
                          ${map(
                            ds.statusBreakdown.filter(
                              s => s.status !== 'PASSING'
                            ),
                            s => html`
                              <span
                                class="status-chip"
                                style="--chip-color: ${s.color}"
                              >
                                ${s.count} ${s.status.toLowerCase()}
                              </span>
                            `
                          )}
                        </div>
                      `
                    : nothing}
                </div>
              </md-outlined-card>
            `
          )}
        </div>
      </div>
    `;
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.fetchDashboardSummaries();
  }

  private async fetchDashboardSummaries() {
    try {
      const data = await this.dashboardSummariesController.fetch(
        `dashboard-summaries-${this.groupName}`,
        () => apiClient.getDashboardSummaries(this.groupName)
      );
      this.dashboardSummaries = data.dashboardSummaries.map(summary =>
        TestgridGroupSummary.convertResponse(summary)
      );
      this.calculateOverallSummary(data.dashboardSummaries);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not get dashboard summaries: ${error}`);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateOverallSummary(summaries: DashboardSummary[]) {
    let totalPassing = 0;
    let totalTabs = 0;
    const aggregateMap: Record<string, number> = {};

    summaries.forEach(summary => {
      for (const [rawStatus, count] of Object.entries(summary.tabStatusCount)) {
        const status = rawStatus || 'UNKNOWN';
        if (status === 'PASSING') {
          totalPassing += count;
        }
        totalTabs += count;
        aggregateMap[status] = (aggregateMap[status] || 0) + count;
      }
    });

    const statusAggregates: StatusBreakdown[] = SORTED_STATUSES.filter(
      status => aggregateMap[status] > 0
    ).map(status => ({
      status,
      count: aggregateMap[status],
      color: STATUS_COLOR_MAP[status] || 'var(--tg-status-unknown)',
    }));

    this.overallSummary = {
      totalPassing,
      totalTabs,
      totalDashboards: summaries.length,
      statusAggregates,
    };
  }

  private handleDashboardClick(event: Event, dashboardName: string) {
    event.preventDefault();
    navigateWithContext(dashboardName, 'dashboard', this.groupName);
  }

  private handleCardKeydown(event: KeyboardEvent, dashboardName: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigateWithContext(dashboardName, 'dashboard', this.groupName);
    }
  }

  private static convertResponse(
    summary: DashboardSummary
  ): RenderedDashboardSummary {
    let passingTabs = 0;
    let totalTabs = 0;
    const statusBreakdown: StatusBreakdown[] = [];

    // Normalize empty string status keys to 'UNKNOWN'
    const statusCounts: Record<string, number> = {};
    for (const [rawKey, value] of Object.entries(summary.tabStatusCount)) {
      const key = rawKey || 'UNKNOWN';
      statusCounts[key] = (statusCounts[key] || 0) + value;
      if (key === 'PASSING') {
        passingTabs = value;
      }
      totalTabs += value;
    }

    SORTED_STATUSES.forEach(status => {
      if (statusCounts[status] > 0) {
        statusBreakdown.push({
          status,
          count: statusCounts[status],
          color: STATUS_COLOR_MAP[status] || 'var(--tg-status-unknown)',
        });
      }
    });

    return {
      name: summary.name,
      overallStatus: summary.overallStatus,
      totalTabs,
      passingTabs,
      statusBreakdown,
    };
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        padding: 2rem;
      }

      .container {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
      }

      .loading {
        padding: 4rem 0;
      }

      .empty-state {
        padding: 4rem 0;
        text-align: center;
        color: var(--tg-text-secondary);
        font-size: var(--font-size-md);
      }

      .page-header {
        margin-bottom: 1.5rem;
      }

      .page-header h1 {
        margin: 0 0 0.25rem;
        font-size: 1.75rem;
        font-weight: 500;
        color: var(--tg-text);
      }

      .subtitle {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--tg-text-secondary);
      }

      /* Hero summary card */
      .hero-card {
        margin-bottom: 1.5rem;
      }

      .hero-content {
        padding: 1.5rem;
      }

      .hero-stats {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 600;
        color: var(--tg-text);
      }

      .stat-value.passing {
        color: var(--tg-status-pass);
      }

      .stat-label {
        font-size: var(--font-size-xs);
        color: var(--tg-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-divider {
        font-size: 1.5rem;
        color: var(--tg-text-secondary);
        margin: 0 0.25rem;
        align-self: center;
      }

      .stat-dashboards {
        margin-left: auto;
      }

      .hero-chips {
        margin-top: 1rem;
      }

      /* Dashboard card grid */
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1rem;
      }

      .dashboard-card {
        cursor: pointer;
        border-left: 4px solid var(--card-status-color);
        position: relative;
      }

      .card-content {
        padding: 1rem 1.25rem;
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .card-title {
        font-size: var(--font-size-md);
        font-weight: 500;
        color: var(--tg-text);
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .card-progress-label {
        font-size: var(--font-size-xs);
        color: var(--tg-text-secondary);
        margin-bottom: 0.5rem;
      }

      /* Stacked status bar */
      .status-bar {
        display: flex;
        height: 6px;
        border-radius: 3px;
        overflow: hidden;
        background: var(--tg-border);
      }

      .status-bar-segment {
        height: 100%;
        min-width: 2px;
      }

      /* Lightweight status chips */
      .card-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .status-chip {
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.5rem;
        border-radius: 1rem;
        font-size: var(--font-size-xs);
        font-weight: 500;
        color: var(--chip-color);
        background: color-mix(in srgb, var(--chip-color) 15%, transparent);
      }

      @media (max-width: 768px) {
        :host {
          padding: 1rem;
        }

        .card-grid {
          grid-template-columns: 1fr;
        }

        .hero-stats {
          flex-wrap: wrap;
        }
      }
    `,
  ];
}
