import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
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
  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  `;

  /**
   * Lit-element lifecycle method.
   * Invoked on each update to perform rendering tasks.
   */
  render() {
    return html`<testgrid-router></testgrid-router>`;
  }
}
