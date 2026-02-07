import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { map } from 'lit/directives/map.js';
import { sharedStyles } from './styles/shared-styles.js';
import { navigationContext, NavigationState, BreadcrumbItem, defaultNavigationState } from './contexts/navigation-context.js';
import { apiClient } from './APIClient.js';
import { navigateWithContext } from './utils/navigation.js';
import { ListDashboardsResponse } from './gen/pb/api/v1/data.js';

interface SearchResult {
  name: string;
  type: 'dashboard' | 'group';
  dashboardGroupName?: string;
}

/**
 * Global header component with logo, breadcrumbs, and search.
 */
@customElement('testgrid-header')
export class TestgridHeader extends LitElement {
  @consume({ context: navigationContext, subscribe: true })
  @property({ attribute: false })
  navigationState: NavigationState = defaultNavigationState;

  @state()
  private searchValue = '';

  @state()
  private searchResults: SearchResult[] = [];

  @state()
  private showResults = false;

  @state()
  private dashboards: ListDashboardsResponse | null = null;

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.loadDashboards();
    document.addEventListener('click', this.handleOutsideClick);
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOutsideClick);
  }

  private handleOutsideClick = (e: Event) => {
    const target = e.target as Node | null;
    if (target && !this.contains(target)) {
      this.showResults = false;
    }
  };

  private async loadDashboards() {
    try {
      this.dashboards = await apiClient.getDashboards();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load dashboards for search:', error);
    }
  }

  render() {
    return html`
      <header class="header">
        <div class="header-content">
          <div class="header-left">
            <a href="/" class="logo" @click=${this.handleLogoClick}>
              <span class="logo-text">TestGrid</span>
            </a>
            <nav class="breadcrumbs" aria-label="Breadcrumb">
              ${map(this.navigationState.breadcrumbs, (item, index) =>
                this.renderBreadcrumb(item, index, this.navigationState.breadcrumbs.length)
              )}
            </nav>
          </div>
          <div class="header-right">
            <div class="search-container">
              <div class="search-wrapper">
                <span class="search-icon">search</span>
                <input
                  type="text"
                  class="search-input"
                  placeholder="Search dashboards and tabs..."
                  .value=${this.searchValue}
                  @input=${this.handleSearchInput}
                  @focus=${this.handleSearchFocus}
                  @keydown=${this.handleSearchKeydown}
                />
              </div>
              ${this.showResults && this.searchValue.length > 0 ? this.renderSearchResults() : nothing}
            </div>
          </div>
        </div>
      </header>
    `;
  }

  private renderSearchResults() {
    if (this.searchResults.length === 0) {
      return html`
        <div class="search-results">
          <div class="search-result-empty">No results found</div>
        </div>
      `;
    }

    return html`
      <div class="search-results">
        ${map(this.searchResults, (result) => html`
          <button
            class="search-result-item"
            @click=${() => this.handleResultClick(result)}
          >
            <span class="result-name">${result.name}</span>
            ${result.dashboardGroupName ? html`<span class="result-parent">in ${result.dashboardGroupName}</span>` : nothing}
          </button>
        `)}
      </div>
    `;
  }

  private renderBreadcrumb(item: BreadcrumbItem, index: number, total: number) {
    // Skip "index" type - TestGrid logo serves as home link
    if (item.type === 'index') {
      return '';
    }

    const isLast = index === total - 1;
    const isFirst = index === 1; // First after home

    return html`
      ${!isFirst ? html`<span class="separator">/</span>` : ''}
      ${isLast
        ? html`<span class="breadcrumb-current">${item.label}</span>`
        : html`<a
            href="${item.path}"
            class="breadcrumb-link"
            @click=${(e: Event) => this.handleBreadcrumbClick(e, item)}
          >${item.label}</a>`
      }
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  private handleLogoClick(e: Event) {
    e.preventDefault();
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  // eslint-disable-next-line class-methods-use-this
  private handleBreadcrumbClick(e: Event, item: BreadcrumbItem) {
    e.preventDefault();
    const historyState = {
      type: item.type === 'group' ? 'dashboard-group' : 'dashboard',
      dashboardGroupName: item.dashboardGroupName
    };
    window.history.pushState(historyState, '', item.path);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  private handleSearchInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.searchValue = input.value;
    this.performSearch(this.searchValue);
  }

  private handleSearchFocus() {
    if (this.searchValue.length > 0) {
      this.showResults = true;
    }
  }

  private handleSearchKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.showResults = false;
    } else if (e.key === 'Enter' && this.searchResults.length > 0) {
      this.handleResultClick(this.searchResults[0]);
    }
  }

  private performSearch(query: string) {
    if (!this.dashboards || query.length === 0) {
      this.searchResults = [];
      this.showResults = false;
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search dashboards
    for (const dashboard of this.dashboards.dashboards) {
      if (dashboard.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          name: dashboard.name,
          type: 'dashboard',
          dashboardGroupName: dashboard.dashboardGroupName || undefined
        });
      }
    }

    // Sort by name
    results.sort((a, b) => a.name.localeCompare(b.name));

    this.searchResults = results;
    this.showResults = true;
  }

  private handleResultClick(result: SearchResult) {
    this.showResults = false;
    this.searchValue = '';
    navigateWithContext(result.name, 'dashboard', result.dashboardGroupName);
  }

  static styles = [sharedStyles, css`
    :host {
      display: block;
      font-family: var(--font-family);
    }

    .header {
      background: var(--tg-header-bg);
      color: var(--tg-header-text);
      height: var(--tg-header-height);
      display: flex;
      align-items: center;
      padding: 0 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex: 1;
      min-width: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: inherit;
      font-weight: 600;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .logo:hover {
      opacity: 0.9;
    }

    .search-icon {
      font-family: 'Material Icons';
      font-size: 1.25rem;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .separator {
      color: var(--tg-breadcrumb-separator);
    }

    .breadcrumb-link {
      color: var(--tg-header-text);
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .breadcrumb-link:hover {
      opacity: 1;
      text-decoration: underline;
    }

    .breadcrumb-current {
      color: var(--tg-header-text);
      font-weight: 500;
    }

    .search-container {
      position: relative;
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 0.25rem 0.75rem;
      transition: background 0.2s;
    }

    .search-wrapper:focus-within {
      background: rgba(255, 255, 255, 0.2);
    }

    .search-icon {
      color: rgba(255, 255, 255, 0.7);
      margin-right: 0.5rem;
    }

    .search-input {
      background: transparent;
      border: none;
      color: var(--tg-header-text);
      font-size: 0.875rem;
      width: 250px;
      outline: none;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .search-results {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 350px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
    }

    .search-result-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      cursor: pointer;
      text-align: left;
      border-bottom: 1px solid var(--tg-border-light);
      transition: background 0.1s;
    }

    .search-result-item:hover {
      background: var(--tg-border-light);
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .result-name {
      font-size: 0.875rem;
      color: var(--tg-text);
      font-weight: 500;
    }

    .result-parent {
      font-size: 0.75rem;
      color: #666;
      margin-top: 2px;
    }

    .search-result-empty {
      padding: 1rem;
      color: #666;
      text-align: center;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .breadcrumbs {
        display: none;
      }

      .search-input {
        width: 150px;
      }

      .search-results {
        min-width: 280px;
      }
    }
  `];
}
