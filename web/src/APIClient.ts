import {
  ListDashboardsResponse,
  ListDashboardGroupsResponse,
  ListDashboardTabsResponse,
  ListTabSummariesResponse,
  ListHeadersResponse,
  ListRowsResponse,
  GetDashboardResponse,
  ListDashboardSummariesResponse,
} from './gen/pb/api/v1/data.js';

interface IAPIClient {
  getDashboards(): Promise<ListDashboardsResponse>;
  getDashboardGroups(): Promise<ListDashboardGroupsResponse>;
  getDashboardTabs(dashboardName: string): Promise<ListDashboardTabsResponse>;
  getTabSummaries(dashboardName: string): Promise<ListTabSummariesResponse>;
  getTabHeaders(
    dashboardName: string,
    tabName: string
  ): Promise<ListHeadersResponse>;
  getTabRows(dashboardName: string, tabName: string): Promise<ListRowsResponse>;
  getDashboard(dashboardName: string): Promise<GetDashboardResponse>;
  getDashboardSummaries(groupName: string): Promise<ListDashboardSummariesResponse>;
}

class APIClient implements IAPIClient {
  private baseUrl: string;

  // TODO(jbpratt): https
  constructor(
    baseUrl = `http://${process.env.API_HOST}:${process.env.API_PORT}`
  ) {
    this.baseUrl = baseUrl;
  }

  async getDashboards(): Promise<ListDashboardsResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/dashboards`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboards: ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return ListDashboardsResponse.fromJson(json, { ignoreUnknownFields: true });
  }

  async getDashboardGroups(): Promise<ListDashboardGroupsResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/dashboard-groups`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard groups: ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return ListDashboardGroupsResponse.fromJson(json, {
      ignoreUnknownFields: true
    });
  }

  async getDashboardTabs(
    dashboardName: string
  ): Promise<ListDashboardTabsResponse> {
    const encodedName = encodeURIComponent(dashboardName);
    const response = await fetch(
      `${this.baseUrl}/api/v1/dashboards/${encodedName}/tabs`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard tabs for "${dashboardName}": ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return ListDashboardTabsResponse.fromJson(json, {
      ignoreUnknownFields: true
    });
  }

  async getTabSummaries(
    dashboardName: string
  ): Promise<ListTabSummariesResponse> {
    const encodedName = encodeURIComponent(dashboardName);
    const response = await fetch(
      `${this.baseUrl}/api/v1/dashboards/${encodedName}/tab-summaries`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch tab summaries for "${dashboardName}": ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return ListTabSummariesResponse.fromJson(json, {
      ignoreUnknownFields: true
    });
  }

  async getTabHeaders(
    dashboardName: string,
    tabName: string
  ): Promise<ListHeadersResponse> {
    const encodedDashboard = encodeURIComponent(dashboardName);
    const encodedTab = encodeURIComponent(tabName);
    const response = await fetch(
      `${this.baseUrl}/api/v1/dashboards/${encodedDashboard}/tabs/${encodedTab}/headers`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch headers for "${dashboardName}/${tabName}": ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return ListHeadersResponse.fromJson(json, { ignoreUnknownFields: true });
  }

  async getTabRows(
    dashboardName: string,
    tabName: string
  ): Promise<ListRowsResponse> {
    const encodedDashboard = encodeURIComponent(dashboardName);
    const encodedTab = encodeURIComponent(tabName);
    const response = await fetch(
      `${this.baseUrl}/api/v1/dashboards/${encodedDashboard}/tabs/${encodedTab}/rows`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch rows for "${dashboardName}/${tabName}": ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return ListRowsResponse.fromJson(json, { ignoreUnknownFields: true });
  }

  async getDashboard(dashboardName: string): Promise<GetDashboardResponse> {
    const encodedName = encodeURIComponent(dashboardName);
    const response = await fetch(
      `${this.baseUrl}/api/v1/dashboards/${encodedName}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard "${dashboardName}": ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    return GetDashboardResponse.fromJson(json, { ignoreUnknownFields: true });
  }

  async getDashboardSummaries(groupName: string): Promise<ListDashboardSummariesResponse> {
    const encodedGroup = encodeURIComponent(groupName);
    const response = await fetch(`${this.baseUrl}/api/v1/dashboard-groups/${encodedGroup}/dashboard-summaries`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard summaries for group "${groupName}": ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return ListDashboardSummariesResponse.fromJson(json, { ignoreUnknownFields: true });
  }
}

export const apiClient = new APIClient();

export const createApiClient = (baseUrl: string): IAPIClient =>
  new APIClient(baseUrl);
