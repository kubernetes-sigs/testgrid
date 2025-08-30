import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import {
  ListDashboardSummariesResponse,
  DashboardSummary,
} from './gen/pb/api/v1/data.js';
import { getStatusIcon } from './constants/status-icons.js';
import { APIController } from './controllers/api-controller.js';
import { apiClient } from './APIClient.js';
import { sharedStyles } from './styles/shared-styles.js';

/**
 * RenderedDashboardSummary defines the dashboard summary representation required for rendering
 */
interface RenderedDashboardSummary {
  name: string;
  overallStatus: string;
  icon: string;
  tabDescription: string;
}

@customElement('testgrid-group-summary')
export class TestgridGroupSummary extends LitElement {
  @property({ type: String })
  groupName = '';

  @state()
  dashboardSummaries: RenderedDashboardSummary[] = [];

  private dashboardSummariesController = new APIController<ListDashboardSummariesResponse>(this);

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Dashboard</th>
            <th>Health</th>
          </tr>
        </thead>
        <tbody>
          ${map(
            this.dashboardSummaries,
            (ds: RenderedDashboardSummary) => html`
              <tr>
                <td>
                  <i class="material-icons ${ds.overallStatus}">${ds.icon}</i>
                </td>
                <td>${ds.name}</td>
                <td>${ds.tabDescription}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
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
      const summaries: RenderedDashboardSummary[] = [];
      data.dashboardSummaries.forEach(summary =>
        summaries.push(TestgridGroupSummary.convertResponse(summary))
      );
      this.dashboardSummaries = summaries;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not get dashboard summaries: ${error}`);
    }
  }

  private static convertResponse(summary: DashboardSummary) {
    const sortedStatuses: string[] = [
      'PASSING',
      'ACCEPTABLE',
      'FLAKY',
      'FAILING',
      'STALE',
      'BROKEN',
      'PENDING',
    ];

    let numPassing = 0;
    let total = 0;
    for (const [key, value] of Object.entries(summary.tabStatusCount)) {
      if (key === 'PASSING') {
        numPassing = value;
      }
      total += value;
    }

    let prefix = `${numPassing} / ${total} PASSING`;
    const descriptions: string[] = [];
    sortedStatuses.forEach(status => {
      if (summary.tabStatusCount[status] > 0) {
        descriptions.push(`${summary.tabStatusCount[status]} ${status}`);
      }
    });

    if (descriptions.length > 0) {
      prefix += ` (${descriptions.join(', ')})`;
    }

    const rds: RenderedDashboardSummary = {
      name: summary.name,
      overallStatus: summary.overallStatus,
      icon: getStatusIcon(summary.overallStatus),
      tabDescription: prefix,
    };

    return rds;
  }

  static styles = [sharedStyles, css`
    body {
      font-size: var(--font-size-xs);
    }

    .material-icons {
      font-size: var(--font-size-icon);
    }

    th,
    td {
      padding: 0.5em 2em;
    }

    thead {
      background-color: var(--tg-border);
    }

    table {
      border-radius: 6px;
      border: 1px solid var(--tg-border-lighter);
      border-spacing: 0;
    }

    .PENDING {
      color: var(--tg-status-pending);
    }

    .PASSING {
      color: var(--tg-status-pass);
    }

    .FAILING {
      color: var(--tg-status-fail);
    }

    .FLAKY {
      color: var(--tg-status-flaky);
    }

    .ACCEPTABLE {
      color: var(--tg-status-acceptable);
    }

    .STALE {
      color: var(--tg-status-stale);
    }

    .BROKEN {
      color: var(--tg-status-broken);
    }
  `];
}
