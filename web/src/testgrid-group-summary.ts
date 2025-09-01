import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import {
  ListDashboardSummariesResponse,
  DashboardSummary,
} from './gen/pb/api/v1/data.js';
import { APIController } from './controllers/api-controller.js';
import { apiClient } from './APIClient.js';
import { sharedStyles } from './styles/shared-styles.js';
import { navigate } from './utils/navigation.js';
import './testgrid-status-indicator.js';

/**
 * RenderedDashboardSummary defines the dashboard summary representation required for rendering
 */
interface RenderedDashboardSummary {
  name: string;
  overallStatus: string;
  tabDescription: string;
}

@customElement('testgrid-group-summary')
export class TestgridGroupSummary extends LitElement {
  @property({ type: String })
  groupName = '';

  @state()
  dashboardSummaries: RenderedDashboardSummary[] = [];

  @state()
  overallSummary: { totalPassing: number; totalTabs: number } = { totalPassing: 0, totalTabs: 0 };

  private dashboardSummariesController = new APIController<ListDashboardSummariesResponse>(this);

  render() {
    return html`
      <div class="container">
        <h1>Dashboard Group ${this.groupName} :: Overview</h1>

        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Dashboard</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td><i>OVERALL</i></td>
              <td>${this.overallSummary.totalPassing} / ${this.overallSummary.totalTabs} Tabs Passing</td>
            </tr>
            ${map(
      this.dashboardSummaries,
      (ds: RenderedDashboardSummary) => html`
                <tr>
                  <td>
                    <testgrid-status-indicator status="${ds.overallStatus}"></testgrid-status-indicator>
                  </td>
                  <td>
                    <a href="#" @click=${(e: Event) => TestgridGroupSummary.handleDashboardClick(e, ds.name)} class="dashboard-link">
                      ${ds.name}
                    </a>
                  </td>
                  <td>${ds.tabDescription}</td>
                </tr>
              `
    )}
          </tbody>
        </table>
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
      const summaries: RenderedDashboardSummary[] = [];
      data.dashboardSummaries.forEach(summary =>
        summaries.push(TestgridGroupSummary.convertResponse(summary))
      );
      this.dashboardSummaries = summaries;
      this.calculateOverallSummary(data.dashboardSummaries);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not get dashboard summaries: ${error}`);
    }
  }

  private calculateOverallSummary(summaries: DashboardSummary[]) {
    let totalPassing = 0;
    let totalTabs = 0;

    summaries.forEach(summary => {
      for (const [status, count] of Object.entries(summary.tabStatusCount)) {
        if (status === 'PASSING') {
          totalPassing += count;
        }
        totalTabs += count;
      }
    });

    this.overallSummary = { totalPassing, totalTabs };
  }

  private static handleDashboardClick(event: Event, dashboardName: string) {
    event.preventDefault();
    navigate(dashboardName);
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
      tabDescription: prefix,
    };

    return rds;
  }

  static styles = [sharedStyles, css`
    :host {
      display: flex;
      padding: 2rem;
    }

    .container {
      width: 100%;
    }

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
      width: 100%;
    }

    tbody tr:nth-child(odd) {
      background-color: var(--tg-surface);
    }

    .dashboard-link:hover {
      color: var(--tg-link-hover-color);
    }
  `];
}
