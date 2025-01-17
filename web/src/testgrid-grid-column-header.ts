import { LitElement, html, css } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('testgrid-grid-column-header')
export class TestgridGridColumnHeader extends LitElement {
  static styles = css`
    :host {
      text-align: center;
      font-family: Roboto, Verdana, sans-serif;
      display: inline-block;
      background-color: #ccd;
      color: #224;
      min-height: 22px;
      max-height: 22px;
      padding: 0.1em 0.3em;
      box-sizing: border-box;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }
    span {
      position: sticky;
      left: 0;
      right: 0;
      width: fit-content;
      margin: auto;
    }
  `;

  @property() value: string;

  render() {
    return html`<span>${this.value}</span>`;
  }
}
