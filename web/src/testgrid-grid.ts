import { LitElement, html, PropertyValues, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { customElement, property, state, query } from 'lit/decorators.js';
import {
  ListHeadersResponse,
  ListRowsResponse,
  // eslint-disable-next-line camelcase
  ListRowsResponse_Row,
} from './gen/pb/api/v1/data.js';
import { APIController } from './controllers/api-controller.js';
import { apiClient } from './APIClient.js';
import './testgrid-grid-headers-block.js';
import './testgrid-grid-row.js';
import './testgrid-context-menu.js';
import { MenuItemData } from './testgrid-context-menu.js';

/**
 * Class definition for `testgrid-grid` component.
 * Renders the test results grid.
 */
@customElement('testgrid-grid')
export class TestgridGrid extends LitElement {
  static styles = css`
    :host {
      display: block;
      overflow: scroll;
      width: 100%;
      height: 100%;
    }
  `;

  @property({ type: String, reflect: true })
  dashboardName: string = '';

  @property({ type: String, reflect: true })
  tabName: string = '';

  @state()
    // eslint-disable-next-line camelcase
  tabGridRows: Array<ListRowsResponse_Row> = [];

  @state()
  tabGridHeaders: ListHeadersResponse;

  @state()
  showContextMenu: boolean = false;

  @state()
  contextMenuX: number = 0;

  @state()
  contextMenuY: number = 0;

  @state()
  contextMenuItems: MenuItemData[] = [];

  @query('testgrid-context-menu')
  contextMenu?: HTMLElement;

  private headersController = new APIController<ListHeadersResponse>(this);

  private rowsController = new APIController<ListRowsResponse>(this);

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('show-context-menu', this.handleShowContextMenu as EventListener);
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('show-context-menu', this.handleShowContextMenu as EventListener);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleShowContextMenu = (e: CustomEvent) => {
    // Close any existing menu first
    this.showContextMenu = false;

    // Wait for the next frame to ensure the old menu is removed
    requestAnimationFrame(() => {
      this.contextMenuX = e.detail.x;
      this.contextMenuY = e.detail.y;
      this.contextMenuItems = e.detail.menuItems;
      this.showContextMenu = true;
    });
  }

  private handleDocumentClick = (e: MouseEvent) => {
    // Close menu if clicking outside
    if (this.showContextMenu && this.contextMenu && !this.contextMenu.contains(e.target as Node)) {
      this.showContextMenu = false;
    }
  }

  private handleMenuClose = () => {
    this.showContextMenu = false;
  }

  /**
   * Lit-element lifecycle method.
   * Invoked when element properties are changed.
   */
  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('tabName')) {
      this.fetchTabGrid();
    }
  }

  /**
   * Lit-element lifecycle method.
   * Invoked on each update to perform rendering tasks.
   */
  render() {
    const buildIds = this.tabGridHeaders?.headers?.map(h => h.build) || [];

    return html`
      <testgrid-grid-headers-block
        .headers="${this.tabGridHeaders}"
      ></testgrid-grid-headers-block>
      ${map(
      this.tabGridRows,
      (row: ListRowsResponse_Row) =>
        html`<testgrid-grid-row
            .name="${row.name}"
            .rowData="${row}"
            .buildIds="${buildIds}"
            .dashboardName="${this.dashboardName}"
            .tabName="${this.tabName}"
          ></testgrid-grid-row>`
    )}
      ${this.showContextMenu ? html`
        <testgrid-context-menu
          .x="${this.contextMenuX}"
          .y="${this.contextMenuY}"
          .menuItems="${this.contextMenuItems}"
          @menu-close="${this.handleMenuClose}"
        ></testgrid-context-menu>
      ` : ''}
    `;
  }

  private async fetchTabGrid() {
    this.fetchTabGridRows();
    this.fetchTabGridHeaders();
  }

  private async fetchTabGridRows() {
    this.tabGridRows = [];
    try {
      const data = await this.rowsController.fetch(
        `tab-rows-${this.dashboardName}-${this.tabName}`,
        () => apiClient.getTabRows(this.dashboardName, this.tabName)
      );
      // eslint-disable-next-line camelcase
      const rows: Array<ListRowsResponse_Row> = [];
      data.rows.forEach(row => rows.push(row));
      this.tabGridRows = rows;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not get grid rows: ${error}`);
    }
  }

  private async fetchTabGridHeaders() {
    try {
      const data = await this.headersController.fetch(
        `tab-headers-${this.dashboardName}-${this.tabName}`,
        () => apiClient.getTabHeaders(this.dashboardName, this.tabName)
      );
      this.tabGridHeaders = data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not get grid headers: ${error}`);
    }
  }
}
