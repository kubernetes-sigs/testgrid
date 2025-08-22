import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import {
  ListDashboardsResponse,
  ListDashboardGroupsResponse,
} from './gen/pb/api/v1/data.js';
import { apiClient } from './APIClient.js';
import { navigateWithContext } from './utils/navigation.js';
import { APIController } from './controllers/api-controller.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
interface GridItem {
  type: 'dashboard-group' | 'dashboard'
  name: string
  children: Array<GridItem> | null
}

@customElement('testgrid-index')
export class TestgridIndex extends LitElement {
  private dashboardGroupsController = new APIController<ListDashboardGroupsResponse>(this);

  private dashboardsController = new APIController<ListDashboardsResponse>(this);

  @state()
  private _dashboardGroups: Record<string, Array<string>> = {};

  @state()
  private _ungroupedDashboards: Array<string> = [];

  @property({ type: String })
  searchTerm = '';

  get dashboardGroups() {
    return this._dashboardGroups;
  }

  set dashboardGroups(value: Record<string, Array<string>>) {
    this._dashboardGroups = value;
  }

  get ungroupedDashboards() {
    return this._ungroupedDashboards;
  }

  set ungroupedDashboards(value: Array<string>) {
    this._ungroupedDashboards = value;
  }

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

    Object.keys(this._dashboardGroups).forEach(groupName => {
      const dashboards = this._dashboardGroups[groupName] || [];
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

    this._ungroupedDashboards.forEach(dashboardName => {
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
        @click=${() => navigateWithContext(item.name, item.type)}
        @keydown=${(e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateWithContext(item.name, item.type);
        }
      }}
      >
        <div class="card-content">
          <p class="card-title">${item.name}</p>
        </div>
        ${item.children && item.children.length > 0 ? html`
          <div class="dashboard-tooltip">
            <div class="tooltip-content">
              <md-list activatable>
                ${map(item.children, (child: GridItem, index: number) => html`
                  <md-list-item id=${index} @click=${(e: Event) => {
                    e.stopPropagation();
                    navigateWithContext(child.name, child.type);
                  }}>
                    <p>${child.name}</p>
                  </md-list-item>
                `)}
              </md-list>
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

    .tooltip-content md-list {
      margin: 0;
      padding: 0;
      --md-list-item-container-height: 32px;
      --md-sys-color-surface: #fff; 
      --md-sys-color-on-surface: #333;
    }

    .tooltip-content md-list-item {
      font-size: 16px;
      color: var(--md-sys-color-on-surface);
      --md-list-item-leading-space: 0;
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
      const [groupsResponse, dashboardsResponse] = await Promise.all([
        this.dashboardGroupsController.fetch('dashboard-groups', () => apiClient.getDashboardGroups()),
        this.dashboardsController.fetch('dashboards', () => apiClient.getDashboards())
      ]);

      const dashboardGroups: Record<string, Array<string>> = {};
      const ungroupedDashboards: Array<string> = [];

      groupsResponse.dashboardGroups.forEach(group => {
        dashboardGroups[group.name] = [];
      });

      dashboardsResponse.dashboards.forEach(dashboard => {
        const groupName = dashboard.dashboardGroupName;

        if (groupName && dashboardGroups[groupName]) {
          dashboardGroups[groupName].push(dashboard.name);
        } else {
          ungroupedDashboards.push(dashboard.name);
        }
      });

      this._dashboardGroups = dashboardGroups;
      this._ungroupedDashboards = ungroupedDashboards;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load data:', error);
    }
  }
}
