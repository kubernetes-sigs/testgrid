import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { provide } from '@lit/context';
import { navigateTab } from './utils/navigation.js';
import { ListDashboardTabsResponse } from './gen/pb/api/v1/data.js';
import { type TestGridLinkTemplate, linkContext } from './testgrid-context.js';
import { APIController } from './controllers/api-controller.js';
import { apiClient } from './APIClient.js';
import '@material/mwc-tab';
import '@material/mwc-tab-bar';
import './testgrid-dashboard-summary.js';
import './testgrid-grid.js';

/**
 * Class definition for the `testgrid-data-content` element.
 * Acts as a container for dashboard summary or grid data.
 */
@customElement('testgrid-data-content')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TestgridDataContent extends LitElement {
  static styles = css`
    :host {
      display: grid;
      grid-template-rows: minmax(1em, auto) minmax(0, 100%);
      width: 100%;
      height: 100%;
    }

    mwc-tab {
      --mdc-typography-button-letter-spacing: 0;
      --mdc-tab-horizontal-padding: 12px;
      --mdc-typography-button-font-size: 0.8rem;
    }
  `;

  @state()
  tabNames: string[] = [];

  @state()
  activeIndex = 0;

  @property({ type: Boolean })
  showTab = false;

  @property({ type: String })
  dashboardName = '';

  @property({ type: String })
  tabName?: string;

  @provide({ context: linkContext })
  linkTemplate: TestGridLinkTemplate = { url: new URL('https://prow.k8s.io/') };

  private tabsController = new APIController<ListDashboardTabsResponse>(this);

  // set the functionality when any tab is clicked on
  private onTabActivated(event: CustomEvent<{ index: number }>) {
    const tabIndex = event.detail.index;

    if (tabIndex === this.activeIndex) {
      return;
    }

    this.tabName = this.tabNames[tabIndex];

    if (this.activeIndex === 0 || tabIndex === 0) {
      this.showTab = !this.showTab;
    }
    this.activeIndex = tabIndex;
    navigateTab(this.dashboardName, this.tabName);
  }

  private handleTabChanged = (evt: Event) => {
    this.tabName = (<CustomEvent>evt).detail.tabName;
    this.showTab = !this.showTab;
    this.highlightIndex(this.tabName);
    navigateTab(this.dashboardName, this.tabName!);
  };

  /**
   * Lit-element lifecycle method.
   * Invoked when a component is added to the document's DOM.
   */
  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this.fetchTabNames();
    window.addEventListener('tab-changed', this.handleTabChanged);
  }

  /**
   * Lit-element lifecycle method.
   * Invoked when a component is removed from the document's DOM.
   */
  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    window.removeEventListener('tab-changed', this.handleTabChanged);
  }

  /**
   * Lit-element lifecycle method.
   * Invoked on each update to perform rendering tasks.
   */
  render() {
    const tabBar = html`${
      // make sure we only render the tabs when there are tabs
      when(
        this.tabNames.length > 0,
        () => html` <mwc-tab-bar
          style="width: 100vw"
          .activeIndex=${this.activeIndex}
          @MDCTabBar:activated="${this.onTabActivated}"
        >
          ${map(
            this.tabNames,
            (name: string) => html`<mwc-tab label=${name}></mwc-tab>`
          )}
        </mwc-tab-bar>`
      )
    }`;
    return html`
      ${tabBar}
      ${!this.showTab
        ? html`<testgrid-dashboard-summary
            .dashboardName=${this.dashboardName}
          ></testgrid-dashboard-summary>`
        : html`<testgrid-grid
            .dashboardName=${this.dashboardName}
            .tabName=${this.tabName}
          ></testgrid-grid>`}
    `;
  }

  // fetch the tab names to populate the tab bar
  private async fetchTabNames() {
    try {
      const data = await this.tabsController.fetch(
        `dashboard-tabs-${this.dashboardName}`,
        () => apiClient.getDashboardTabs(this.dashboardName)
      );
      const tabNames: string[] = ['Summary'];
      data.dashboardTabs.forEach(tab => {
        tabNames.push(tab.name);
      });
      this.tabNames = tabNames;
      this.highlightIndex(this.tabName);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not get dashboard tabs: ${error}`);
    }
  }

  // identify which tab to highlight on the tab bar
  private highlightIndex(tabName: string | undefined) {
    if (tabName === undefined) {
      this.activeIndex = 0;
      return;
    }
    const index = this.tabNames.indexOf(tabName);
    if (index > -1) {
      this.activeIndex = index;
    }
  }
}
