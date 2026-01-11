import { css } from 'lit';

export const sharedStyles = css`
  :host {
    --font-family: Roboto, Verdana, sans-serif;

    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-icon: 2em;

    /* Colors */
    --tg-primary: #707df1;
    --tg-secondary: #9e60eb;
    --tg-border: #e0e0e0;
    --tg-border-light: #ddd;
    --tg-border-lighter: #cbcbcb;
    --tg-surface: #fff;
    --tg-text: #333;

    /* Header colors */
    --tg-header-bg: #1a1a2e;
    --tg-header-text: #fff;
    --tg-header-height: 56px;
    --tg-breadcrumb-separator: #888;
    --tg-link-color: #707df1;
    --tg-link-hover-color: #5a67d8;

    /* Test status colors */
    --tg-status-pass: #4caf50;
    --tg-status-fail: #f44336;
    --tg-status-broken: #e91e63;
    --tg-status-flaky: #ff9800;
    --tg-status-unknown: #9e9e9e;
    --tg-status-stale: #9e9e9e;
    --tg-status-pending: #2196f3;
    --tg-status-acceptable: #8bc34a;
  }
`;
