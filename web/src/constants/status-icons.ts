/**
 * Shared constants for TestGrid status icons and colors
 */

export const TAB_STATUS_ICONS = new Map<string, string>([
  ['PASSING', 'done'],
  ['FAILING', 'warning'],
  ['FLAKY', 'remove_circle_outline'],
  ['STALE', 'error_outline'],
  ['BROKEN', 'broken_image'],
  ['PENDING', 'schedule'],
  ['ACCEPTABLE', 'add_circle_outline'],
]);

export const TAB_STATUS_COLORS = new Map<string, string>([
  ['PASSING', '#4caf50'],
  ['FAILING', '#f44336'],
  ['FLAKY', '#ff9800'],
  ['STALE', '#9e9e9e'],
  ['BROKEN', '#e91e63'],
  ['PENDING', '#2196f3'],
  ['ACCEPTABLE', '#8bc34a'],
]);

/**
 * Get the Material Design icon name for a given test status
 */
export function getStatusIcon(status: string): string {
  return TAB_STATUS_ICONS.get(status) || 'help_outline';
}

/**
 * Get the color for a given test status
 */
export function getStatusColor(status: string): string {
  return TAB_STATUS_COLORS.get(status) || '#9e9e9e';
}