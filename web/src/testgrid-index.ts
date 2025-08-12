import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import {
  ListDashboardsResponse,
  ListDashboardGroupsResponse,
} from './gen/pb/api/v1/data.js';
import { navigate } from './utils/navigation.js';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item.js';

interface GridItem {
  type: 'dashboard-group' | 'dashboard'
  name: string
  children: Array<GridItem> | null
}

@customElement('testgrid-index')
export class TestgridIndex extends LitElement {
  @property({ type: Object })
  dashboardGroups: Record<string, Array<string>> = {};

  @property({ type: Array })
  ungroupedDashboards: Array<string> = [];

  @property({ type: String })
  searchTerm = '';

  /**
   * Lit-element lifecycle method.
   * Invoked when a component is added to the document's DOM.
   */
  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.loadData();
  }

  /**
   * Lit-element lifecycle method.
   * Invoked on each update to perform rendering tasks.
   */
  render() {
    return html`
      <div class="search-container">
        <input
          type="text"
          placeholder="Search dashboards and groups..."
          .value=${this.searchTerm}
          @input=${this.handleSearchInput}
          class="search-input"
        />
      </div>
      ${this.renderGrid()}
    `;
  }

  private handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  // build a sorted, filtered array of dashboard groups and ungrouped dashboards
  private renderGrid() {
    const gridItems: Array<GridItem> = [];

    Object.keys(this.dashboardGroups).forEach(groupName => {
      const dashboards = this.dashboardGroups[groupName] || [];
      const children = dashboards.map(dashboardName => ({
        type: 'dashboard' as const,
        name: dashboardName,
        children: null
      }));

      gridItems.push({
        type: 'dashboard-group',
        name: groupName,
        children
      });
    });

    this.ungroupedDashboards.forEach(dashboardName => {
      gridItems.push({
        type: 'dashboard',
        name: dashboardName,
        children: null
      });
    });

    const filteredItems = gridItems.filter(item =>
      this.searchTerm === '' || item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));

    return html`
      <div class="grid-container">
        ${map(filteredItems, (item: GridItem) => TestgridIndex.renderGridItem(item))}
      </div>
    `;
  }

  private static renderGridItem(item: GridItem) {
    return html`
      <div
        class="grid-card ${item.type}"
        role="button"
        tabindex="0"
        @click=${() => navigate(item.name)}
        @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(item.name);
        }
      }}
      >
        <div class="card-content">
          <p class="card-title">${item.name}</p>
        </div>
        ${item.children && item.children.length > 0 ? html`
          <div class="dashboard-tooltip">
            <div class="tooltip-content">
              <mwc-list activatable>
                ${map(item.children, (child: GridItem, index: number) => html`
                  <mwc-list-item id=${index} @click=${() => navigate(child.name)}>
                    <p>${child.name}</p>
                  </mwc-list-item>
                `)}
              </mwc-list>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  static styles = css`
    /* search input */
    .search-container {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .search-input {
      width: 400px;
      max-width: 90%;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: #707df1;
    }

    /* responsive grid */
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .group-item {
      display: contents;
    }

    .dashboard-grid {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      padding: 10px 0;
    }

    .grid-card.expanded {
      border-color: #707df1;
      box-shadow: 0 2px 8px rgba(112, 125, 241, 0.3);
    }

    .grid-card {
      background: white;
      border: 2px solid #e0e0e0;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 80px;
      display: flex;
      align-items: center;
      position: relative;
    }

    .grid-card:hover {
      border-color: #707df1;
      box-shadow: 0 2px 8px rgba(112, 125, 241, 0.2);
    }

    .grid-card:hover .dashboard-tooltip {
      opacity: 1;
      visibility: visible;
    }

    .dashboard-tooltip {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border: 2px solid #707df1;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 10;
      min-width: 200px;
      max-width: 400px;
      margin-top: 8px;
    }

    .tooltip-content mwc-list {
      margin: 0;
      padding: 0;
      --mdc-list-item-height: 32px;
    }

    .tooltip-content mwc-list-item {
      font-size: 16px;
      color: #333;
      --mdc-list-item-graphic-margin: 0;
    }

    .grid-card.dashboard-group {
      background: #707df1;
      color: white;
    }

    .grid-card.dashboard {
      background: #9e60eb;
      color: white;
    }

    .card-content {
      width: 100%;
    }

    .card-title {
      text-align: center;
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .grid-container {
        grid-template-columns: 1fr;
        padding: 16px;
      }
    }
  `;

  private async loadData() {
    try {
      const result = await TestgridIndex.fetchDashboardGroups();
      this.dashboardGroups = result.dashboardGroups;
      this.ungroupedDashboards = result.ungroupedDashboards;
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  private static async fetchDashboardGroups(): Promise<{
    dashboardGroups: Record<string, Array<string>>;
    ungroupedDashboards: Array<string>;
  }> {
    const groupsResponse = await fetch(
      `http://${process.env.API_HOST}:${process.env.API_PORT}/api/v1/dashboard-groups`
    );

    if (!groupsResponse.ok) {
      throw new Error(`Failed to fetch dashboard groups: ${groupsResponse.statusText}`);
    }

    const dashboardGroupsResp = ListDashboardGroupsResponse.fromJson(
      await groupsResponse.json(),
      { ignoreUnknownFields: true }
    );

    const dashboardGroups: Record<string, Array<string>> = {};
    const ungroupedDashboards: Array<string> = [];

    dashboardGroupsResp.dashboardGroups.forEach(group => {
      dashboardGroups[group.name] = [];
    });

    const dashboardsResponse = await fetch(
      `http://${process.env.API_HOST}:${process.env.API_PORT}/api/v1/dashboards`
    );

    if (!dashboardsResponse.ok) {
      throw new Error(`Failed to fetch dashboards: ${dashboardsResponse.statusText}`);
    }

    const dashboardsResp = ListDashboardsResponse.fromJson(
      await dashboardsResponse.json(),
      { ignoreUnknownFields: true }
    );

    dashboardsResp.dashboards.forEach(dashboard => {
      const groupName = dashboard.dashboardGroupName;

      if (groupName && dashboardGroups[groupName]) {
        dashboardGroups[groupName].push(dashboard.name);
      } else {
        // doesn't belong to any group
        ungroupedDashboards.push(dashboard.name);
      }
    });

    return { dashboardGroups, ungroupedDashboards };
  }
}
