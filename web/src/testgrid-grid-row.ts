import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from './styles/shared-styles.js';
// eslint-disable-next-line camelcase
import { ListRowsResponse_Row } from './gen/pb/api/v1/data.js';
import { TestStatus } from './gen/pb/test_status/test_status.js';
import './testgrid-grid-row-name.js';
import './testgrid-grid-cell.js';

@customElement('testgrid-grid-row')
export class TestgridGridRow extends LitElement {
  static styles = [sharedStyles, css`
    :host {
      text-align: center;
      font-family: var(--font-family);
      display: flex;
      flex-flow: row nowrap;
      gap: 0px 2px;
      margin: 2px;
      width: fit-content;
    }
  `];

  // eslint-disable-next-line camelcase
  @property() rowData: ListRowsResponse_Row;
// TODO(Mostafahassen1): Replace direct property passing with a Lit context structure.
  @property() buildIds: string[] = [];
  @property() dashboardName: String = '';

  @property() tabName: String = '';

  render() {
    return html`
      <testgrid-grid-row-name
        .name="${this.rowData?.name}"
      ></testgrid-grid-row-name>
      ${map(
      this.rowData?.cells,
      (cell, index) => {
        // Use cell index to get corresponding build ID from column data
        const buildId = this.buildIds[index+1] || '';

        return html`<testgrid-grid-cell
          .icon="${cell.icon}"
          .status="${TestStatus[cell.result]}"
          .rowName="${this.rowData.name}"
          .buildId="${buildId}"
          .dashboardName="${this.dashboardName}"
          .tabName="${this.tabName}"
        ></testgrid-grid-cell>`;
      }
    )}
    `;
  }
}
