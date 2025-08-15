/**
 * Navigates application to a specified page.
 * @fires location-changed
 * @param {string} path
 */
export function navigate(name: string) {
  const url = new URL(window.location.href);
  url.pathname = name;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new CustomEvent('location-changed'));
}

/**
 * Navigates application to a specified page with context about the item type.
 * @fires location-changed
 * @param {string} name - The name of the dashboard or group
 * @param {'dashboard-group' | 'dashboard'} type - The type of item being navigated to
 */
export function navigateWithContext(name: string, type: 'dashboard-group' | 'dashboard') {
  const url = new URL(window.location.href);
  url.pathname = name;
  window.history.pushState({ type }, '', url);
  window.dispatchEvent(new CustomEvent('location-changed', { detail: { type } }));
}

/**
 * Changes the URL without reloading
 * @param {string} dashboard
 * @param {string} tab
 */
export function navigateTab(dashboard: string, tab?: string) {
  const url = new URL(window.location.href);
  if (tab === 'Summary' || tab === undefined) {
    url.pathname = `${dashboard}`;
  } else {
    url.pathname = `${dashboard}/${tab}`;
  }
  window.history.pushState(null, '', url);
  window.dispatchEvent(new CustomEvent('location-changed'));
}
