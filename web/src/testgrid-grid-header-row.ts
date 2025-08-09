import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property } from 'lit/decorators.js';
import './testgrid-grid-row-name.js';
import './testgrid-grid-column-header.js';

// CombinedHeader represents a header element that spans multiple columns
// (when a header value is repeated multiple times in a row).
export interface CombinedHeader {
  value: string;
  count: number;
}

@customElement('testgrid-grid-header-row')
export class TestgridGridHeaderRow extends LitElement {
  static styles = css`
    :host {
      text-align: center;
      font-family: Roboto, Verdana, sans-serif;
      display: flex;
      flex-flow: row nowrap;
      gap: 0px 2px;
      margin: 2px;
      width: fit-content;
    }
  `;

  @property() name: string;

  @property() combinedHeaders: CombinedHeader[];

  render() {
    const nameStyles = {background: '#ededed', zIndex: '20'};
    return html`
      <testgrid-grid-row-name .name="${this.name}" style=${styleMap(nameStyles)}></testgrid-grid-row-name>
      ${map(
        this.combinedHeaders,
        header => {
          // TODO(michelle192837): Stop hardcoding header width.
          const width = `${ (header.count - 1) * (80 + 2) + 80 }px`
          const styles = {width, minWidth: width, maxWidth: width};
          return html`
            <testgrid-grid-column-header 
              style=${styleMap(styles)}
              .value="${header.value}"
            ></testgrid-grid-column-header>
          `
        }
      )}
    `;
  }
}
