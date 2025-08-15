import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  ListDashboardsResponse,
  ListDashboardGroupsResponse,
} from './gen/pb/api/v1/data.js';
import { apiClient } from './APIClient.js';
import { APIController } from './controllers/api-controller.js';
import './testgrid-group-summary.js';
import './testgrid-data-content.js';

@customElement('testgrid-summary')
export class TestgridSummary extends LitElement {
  private dashboardGroupsController = new APIController<ListDashboardGroupsResponse>(this);

  private dashboardsController = new APIController<ListDashboardsResponse>(this);

  @property({ type: String })
  name = '';

  @state()
  summaryType: 'dashboard-group' | 'dashboard' | 'unknown' = 'unknown';

  @state()
  isLoading = true;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-size: 16px;
      color: #666;
    }

    .not-found {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      font-size: 18px;
      color: #d32f2f;
    }

    .not-found-subtitle {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
  `;

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.determineSummaryType();
  }

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('name')) {
      this.isLoading = true;
      this.determineSummaryType();
    }
  }

  private async determineSummaryType() {
    const historyState = window.history.state;
    if (historyState && historyState.type) {
      this.summaryType = historyState.type;
      this.isLoading = false;
      return;
    }

    try {
      const [groupsResponse, dashboardsResponse] = await Promise.all([
        this.dashboardGroupsController.fetch('dashboard-groups', () => apiClient.getDashboardGroups()),
        this.dashboardsController.fetch('dashboards', () => apiClient.getDashboards())
      ]);

      const isGroup = groupsResponse.dashboardGroups?.some(g => g.name === this.name);
      if (isGroup) {
        this.summaryType = 'dashboard-group';
        this.isLoading = false;
        return;
      }

      const isDashboard = dashboardsResponse.dashboards?.some(d => d.name === this.name);
      if (isDashboard) {
        this.summaryType = 'dashboard';
        this.isLoading = false;
        return;
      }

      this.isLoading = false;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to determine summary type:', error);
      this.isLoading = false;
    }
  }

  render() {
    if (this.isLoading) {
      return html`<div class="loading">Loading...</div>`;
    }

    switch (this.summaryType) {
      case 'dashboard-group':
        return html`<testgrid-group-summary .groupName=${this.name}></testgrid-group-summary>`;
      case 'dashboard':
        return html`<testgrid-data-content .dashboardName=${this.name}></testgrid-data-content>`;
      default:
        return html`
          <div class="not-found">
            <div>Not found: ${this.name}</div>
            <div class="not-found-subtitle">
              The requested dashboard or group could not be found.
            </div>
          </div>
        `;
    }
  }
}
