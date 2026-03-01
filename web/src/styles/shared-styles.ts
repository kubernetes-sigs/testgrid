import { css, CSSResultGroup } from 'lit';

/**
 * Tailwind base and utilities - processed by postcss-lit at build time.
 * Components import this to get Tailwind classes working in Shadow DOM.
 */
export const tailwindBase = css`
  @tailwind base;
  @tailwind utilities;
`;

/**
 * Shadow DOM CSS variable declarations.
 * Required because Tailwind v4's @property declarations don't inherit into Shadow DOM.
 * These must be declared on :host for Tailwind utilities to work.
 */
export const shadowDOMVars = css`
  :host {
    /* Border and ring defaults for Tailwind utilities */
    --tw-border-style: solid;
    --tw-ring-color: oklch(0.7 0.15 250 / 0.5);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-inset: ;
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;

    /* Shadow defaults */
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;

    /* Transform defaults */
    --tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;

    /* Inherit semantic tokens from :root (these cascade into Shadow DOM) */
    color: var(--foreground);
    background-color: var(--background);
  }
`;

/**
 * Legacy variable aliases for backward compatibility during migration.
 * Maps old --tg-* names to new semantic tokens.
 * Can be removed once all components are updated.
 */
export const legacyVars = css`
  :host {
    /* Font family - unchanged */
    --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    /* Font sizes - unchanged */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-icon: 2em;

    /* Map old --tg-* to new semantic tokens */
    --tg-primary: var(--primary);
    --tg-secondary: var(--accent);
    --tg-border: var(--border);
    --tg-border-light: var(--border);
    --tg-border-lighter: var(--border);
    --tg-surface: var(--background);
    --tg-text: var(--foreground);

    /* Header colors */
    --tg-header-bg: var(--header-bg);
    --tg-header-text: var(--header-text);
    --tg-header-height: 56px;
    --tg-breadcrumb-separator: var(--muted-foreground);
    --tg-link-color: var(--primary);
    --tg-link-hover-color: var(--primary);

    /* Status colors - map to new tokens */
    --tg-status-pass: var(--status-pass);
    --tg-status-fail: var(--status-fail);
    --tg-status-broken: var(--status-broken);
    --tg-status-flaky: var(--status-flaky);
    --tg-status-unknown: var(--status-unknown);
    --tg-status-stale: var(--status-stale);
    --tg-status-pending: var(--status-pending);
    --tg-status-acceptable: var(--status-acceptable);
  }
`;

/**
 * Combined shared styles for all components.
 * Import as: static styles = [sharedStyles, css`...`];
 */
export const sharedStyles: CSSResultGroup = [tailwindBase, shadowDOMVars, legacyVars];
