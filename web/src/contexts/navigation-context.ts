import { createContext } from '@lit/context';

/**
 * Represents a breadcrumb item in the navigation hierarchy
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
  type: 'index' | 'group' | 'dashboard' | 'tab';
  dashboardGroupName?: string;  // Parent group for dashboards/tabs
}

/**
 * Navigation state shared across components
 */
export interface NavigationState {
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
}

/**
 * Default navigation state
 */
export const defaultNavigationState: NavigationState = {
  breadcrumbs: [{ label: 'Index', path: '/', type: 'index' }],
  searchQuery: '',
};

/**
 * Context for sharing navigation state across the app
 */
export const navigationContext = createContext<NavigationState>('testgrid-navigation-context');
