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

    /* Test status colors */
    --tg-status-pass: #4d7;
    --tg-status-fail: #a24;
    --tg-status-broken: #111;
    --tg-status-flaky: #63a;
    --tg-status-unknown: #ccd;
    --tg-status-stale: #ccc;
    --tg-status-pending: #cc8200;
    --tg-status-acceptable: #39a2ae;
  }
`;
