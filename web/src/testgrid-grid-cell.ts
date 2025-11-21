// testgrid-grid-cell.ts
import { LitElement, html, css } from 'lit';
import { consume } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import { linkContext, TestGridLinkTemplate } from './testgrid-context.js';
import { sharedStyles } from './styles/shared-styles.js';
import '@vaadin/context-menu';

@customElement('testgrid-grid-cell')
export class TestgridGridCell extends LitElement {
  // Styling for status attribute corresponds to test_status.proto enum.
  static styles = [sharedStyles, css`
    :host {
      min-width: 80px;
      width: 80px;
      min-height: 22px;
      max-height: 22px;
      color: #000;
      background-color: #ccc;
      text-align: center;
      font-family: var(--font-family);
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-direction: column;
      box-sizing: border-box;
      font-size: var(--font-size-xs);
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

    vaadin-context-menu {
      display: contents;
    }
  `];

  @property({ reflect: true, attribute: 'status' }) status: string;
  @property() icon: string;
  @property() rowName: string = '';
  @property() buildId: string = '';
  @property() dashboardName: string = '';
  @property() tabName: string = '';

  // store all pre-generated URLs
  @property({ attribute: false }) openTestUrl: string = '';
  @property({ attribute: false }) fileBugUrl: string = '';
  @property({ attribute: false }) attachBugUrl: string = '';

  @consume({ context: linkContext })
  @property({ attribute: false })
  public linkTemplate?: TestGridLinkTemplate;

  connectedCallback() {
    super.connectedCallback();

    // Generate URLs once when the cell is created
    this.prepareUrls();
  }

  private prepareUrls() {
    this.openTestUrl = this.generateTestUrl();
    this.fileBugUrl = this.generateFileBugUrl();
    this.attachBugUrl = this.generateAttachToBugUrl();
  }

  private handleMenuItemClick(e: CustomEvent) {
    const item = e.detail.value;

    if (item.url) {
      window.open(item.url, '_blank');
    }
  }

  private generateTestUrl(): string {
    return `https://prow.k8s.io/view/gs/kubernetes-ci-logs/logs/${this.tabName}/${this.buildId}`;
  }

  private generateFileBugUrl(): string {
    const linkUrl = `https://prow.k8s.io/view/gs/kubernetes-ci-logs/logs/${this.tabName}/${this.buildId}`;
    const title = encodeURIComponent(`E2E: ${this.rowName}`);
    const body = encodeURIComponent(`${linkUrl}\n`);
    return `https://github.com/kubernetes/kubernetes/issues/new?title=${title}&body=${body}`;
  }

  private generateAttachToBugUrl(): string {
    const searchQuery = encodeURIComponent(`is:issue is:open ${this.rowName}`);
    return `https://github.com/kubernetes/kubernetes/issues?q=${searchQuery}`;
  }

  private getContextMenuItems() {
    return [
      {
        text: 'Open Test',
        url: this.openTestUrl
      },
      {
        text: 'File a Bug',
        url: this.fileBugUrl
      },
      {
        text: 'Attach to Bug',
        url: this.attachBugUrl
      }
    ];
  }

  render() {
    const content = this.linkTemplate === undefined
      ? html`<span>${this.icon}</span>`
      : html`<a href="${this.linkTemplate.url.toString()}"><span>${this.icon}</span></a>`;

    return html`
      <vaadin-context-menu
        .items="${this.getContextMenuItems()}"
        @item-selected="${this.handleMenuItemClick}">
        ${content}
      </vaadin-context-menu>
    `;
  }
}
