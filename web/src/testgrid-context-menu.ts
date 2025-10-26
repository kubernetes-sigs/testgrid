import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface MenuItemData {
  label: string;
  url: string;
}

@customElement('testgrid-context-menu')
export class TestgridContextMenu extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      min-width: 180px;
      border-radius: 4px;
      overflow: hidden;
    }

    .menu-item {
      padding: 10px 16px;
      cursor: pointer;
      text-decoration: none;
      color: #333;
      display: block;
      font-family: var(--font-family, sans-serif);
      font-size: 14px;
      transition: background-color 0.1s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .menu-item:hover {
      background-color: #f0f0f0;
    }

    .menu-item:active {
      background-color: #e0e0e0;
    }
  `;

  @property({ type: Array }) menuItems: MenuItemData[] = [];
  @property({ type: Number }) x: number = 0;
  @property({ type: Number }) y: number = 0;

  firstUpdated() {
    this.adjustPosition();
  }

  updated() {
    this.adjustPosition();
  }

  private adjustPosition() {
    const rect = this.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = this.x;
    let adjustedY = this.y;

    if (this.x + rect.width > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10;
    }

    if (this.y + rect.height > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 10;
    }

    this.style.left = `${adjustedX}px`;
    this.style.top = `${adjustedY}px`;
  }

  render() {
    if (!this.menuItems || this.menuItems.length === 0) return html``;

    return html`
      ${this.menuItems.map(item => html`
        <a
          class="menu-item"
          href="${item.url}"
          target="_blank"
          @click="${this.handleClick}"
        >
          ${item.label}
        </a>
      `)}
    `;
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent('menu-close'));
  }
}
