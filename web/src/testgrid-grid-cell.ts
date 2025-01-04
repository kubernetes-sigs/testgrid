import { LitElement, html, css } from 'lit';
import {consume} from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { linkContext, TestGridLinkTemplate } from './testgrid-context';

@customElement('testgrid-grid-cell')
export class TestgridGridCell extends LitElement {
  // Styling for status attribute corresponds to test_status.proto enum.
  static styles = css`
    :host {
      min-width: 80px;
      width: 80px;
      min-height: 22px;
      max-height: 22px;
      color: #000;
      background-color: #ccc;
      text-align: center;
      font-family: Roboto, Verdana, sans-serif;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      box-sizing: border-box;
      font-size: 12px;
    }

    :host([status='NO_RESULT']) {
      background-color: transparent;
    }

    :host([status='PASS']),
    :host([status='PASS_WITH_ERRORS']) {
      background-color: #4d7;
      color: #273;
    }

    :host([status='PASS_WITH_SKIPS']),
    :host([status='BUILD_PASSED']) {
      background-color: #bfd;
      color: #465;
    }

    :host([status='RUNNING']),
    :host([status='CATEGORIZED_ABORT']),
    :host([status='UNKNOWN']),
    :host([status='CANCEL']),
    :host([status='BLOCKED']) {
      background-color: #ccd;
      color: #446;
    }

    :host([status='TIMED_OUT']),
    :host([status='CATEGORIZED_FAIL']),
    :host([status='FAIL']),
    :host([status='FLAKY']) {
      background-color: #a24;
      color: #fdd;
    }

    :host([status='BUILD_FAIL']) {
      background-color: #111;
      color: #ddd;
    }

    :host([status='FLAKY']) {
      background-color: #63a;
      color: #dcf;
    }

    a {
      text-decoration: inherit;
      color: inherit;
      width: 100%;
      height: 100%;
    }
  `;

  @property({ reflect: true, attribute: 'status' }) status: string;

  @property() icon: string;

  @consume({context: linkContext})
  @property({attribute: false})
  public linkTemplate?: TestGridLinkTemplate;

  render() {
    if (this.linkTemplate == undefined) {
        return html `<span>${this.icon}</span>`
    }
    return html`<a href="${this.linkTemplate.url.toString()}"><span>${this.icon}</span></a>`;
  }
}
