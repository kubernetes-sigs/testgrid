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
 * @param {string} dashboardGroupName - Optional parent group name for dashboards
 */
export function navigateWithContext(name: string, type: 'dashboard-group' | 'dashboard', dashboardGroupName?: string) {
  const url = new URL(window.location.href);
  url.pathname = name;
  window.history.pushState({ type, dashboardGroupName }, '', url);
  window.dispatchEvent(new CustomEvent('location-changed', { detail: { type, dashboardGroupName } }));
}

/**
 * Changes the URL without reloading, preserving navigation context
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
  // Preserve existing history state (type, dashboardGroupName) when switching tabs
  const existingState = window.history.state || {};
  window.history.pushState(existingState, '', url);
  window.dispatchEvent(new CustomEvent('location-changed'));
}
