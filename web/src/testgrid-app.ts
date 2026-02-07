import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { provide } from '@lit/context';
import { navigationContext, NavigationState, BreadcrumbItem, defaultNavigationState } from './contexts/navigation-context.js';
import { sharedStyles } from './styles/shared-styles.js';
import './testgrid-header.js';
import './testgrid-router.js';

// @ts-ignore: Property 'UrlPattern' does not exist
// eslint-disable-next-line no-undef
if (!globalThis.URLPattern) {
  await import("urlpattern-polyfill");
}

/**
 * Class definition for the `testgrid-app` element.
 * Application root element.
 */
@customElement('testgrid-app')
export class TestgridApp extends LitElement {
  @provide({ context: navigationContext })
  @state()
  navigationState: NavigationState = defaultNavigationState;

  private handleLocationChanged = () => {
    this.updateBreadcrumbs();
  };

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    window.addEventListener('location-changed', this.handleLocationChanged);
    window.addEventListener('popstate', this.handleLocationChanged);
    this.updateBreadcrumbs();
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    window.removeEventListener('location-changed', this.handleLocationChanged);
    window.removeEventListener('popstate', this.handleLocationChanged);
  }

  private updateBreadcrumbs() {
    const {pathname} = window.location;
    const segments = pathname.split('/').filter(Boolean).map(s => decodeURIComponent(s));
    const historyState = window.history.state;

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Index', path: '/', type: 'index' }
    ];

    if (segments.length > 0) {
      const firstName = segments[0];
      const isGroup = historyState?.type === 'dashboard-group';
      const dashboardGroupName = historyState?.dashboardGroupName;

      // If this dashboard belongs to a group, show group first
      if (dashboardGroupName && !isGroup) {
        breadcrumbs.push({
          label: dashboardGroupName,
          path: `/${encodeURIComponent(dashboardGroupName)}`,
          type: 'group'
        });
      }

      // Add the current page (group or dashboard)
      breadcrumbs.push({
        label: firstName,
        path: `/${encodeURIComponent(firstName)}`,
        type: isGroup ? 'group' : 'dashboard',
        dashboardGroupName
      });

      // Tab name if present
      if (segments.length > 1) {
        const tabName = segments.slice(1).join('/');
        breadcrumbs.push({
          label: tabName,
          path: `/${encodeURIComponent(firstName)}/${encodeURIComponent(tabName)}`,
          type: 'tab',
          dashboardGroupName
        });
      }
    }

    this.navigationState = {
      ...this.navigationState,
      breadcrumbs
    };
  }

  static styles = [sharedStyles, css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow: auto;
      background: var(--tg-surface);
    }
  `];

  render() {
    return html`
      <testgrid-header></testgrid-header>
      <main class="main-content">
        <testgrid-router></testgrid-router>
      </main>
    `;
  }
}
