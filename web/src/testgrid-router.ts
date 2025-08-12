import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
import './testgrid-data-content.js';
import './testgrid-index.js';
import './testgrid-group-summary.js';

// Defines the type of params used for rendering components under different paths
interface RouteParameter {
  [key: string]: string | undefined;
}

/**
 * Class definition for the `testgrid-router` element.
 * Handles the routing logic.
 */
@customElement('testgrid-router')
export class TestgridRouter extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  private router = new Router(this, [
    {
      path: '/:groupName/:dashboardName/*',
      render: (params: RouteParameter) =>
        html`
          <testgrid-data-content
            .dashboardName=${params.dashboardName}
            .tabName=${params[0]}
            showTab
          ></testgrid-data-content>
        `
    },
    {
      path: '/:groupName/:dashboardName',
      render: (params: RouteParameter) =>
        html`
          <testgrid-data-content
            .dashboardName=${params.dashboardName}
          ></testgrid-data-content>
        `
    },
    {
      path: '/:groupName',
      render: (params: RouteParameter) =>
        html`
          <testgrid-group-summary
            .groupName=${params.groupName}
          ></testgrid-group-summary>
        `
    },
    {
      path: '/',
      render: () =>
        html`
          <testgrid-index></testgrid-index>
        `
    }
  ]);

  private goToCurrentPath = () => this.router.goto(window.location.pathname);

  /**
   * Lit-element lifecycle method.
   * Invoked when a component is added to the document's DOM.
   */
  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    window.addEventListener('location-changed', this.goToCurrentPath);
    window.addEventListener('popstate', this.goToCurrentPath);
    // Ensure initial render reflects current URL (including direct loads on nested paths)
    this.goToCurrentPath();
  }

  /**
   * Lit-element lifecycle method.
   * Invoked when a component is removed from the document's DOM.
   */
  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    window.removeEventListener('location-changed', this.goToCurrentPath);
    window.removeEventListener('popstate', this.goToCurrentPath);
  }

  /**
   * Lit-element lifecycle method.
   * Invoked on each update to perform rendering tasks.
   */
  render() {
    return html`
      ${this.router.outlet()}
    `;
  }
}
