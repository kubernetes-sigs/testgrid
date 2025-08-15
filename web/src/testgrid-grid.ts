import { LitElement, html, PropertyValues, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { customElement, property, state } from 'lit/decorators.js';
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

  private headersController = new APIController<ListHeadersResponse>(this);

  private rowsController = new APIController<ListRowsResponse>(this);

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
    return html`
      <testgrid-grid-headers-block
        .headers="${this.tabGridHeaders}"
      ></testgrid-grid-headers-block>
      ${map(
        this.tabGridRows,
        // eslint-disable-next-line camelcase
        (row: ListRowsResponse_Row) =>
          html`<testgrid-grid-row
            .name="${row.name}"
            .rowData="${row}"
          ></testgrid-grid-row>`
      )}
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
