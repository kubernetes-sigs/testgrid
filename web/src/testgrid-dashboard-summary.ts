import { LitElement, html } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { Timestamp } from './gen/google/protobuf/timestamp.js';
import { ListTabSummariesResponse, TabSummary } from './gen/pb/api/v1/data.js';
import './tab-summary.js';

export interface TabSummaryInfo {
  icon: string;
  name: string;
  overallStatus: string;
  detailedStatusMsg: string;
  lastUpdateTimestamp: string;
  lastRunTimestamp: string;
  latestGreenBuild: string;
  dashboardName: string;
  failuresSummary?: FailuresSummaryInfo;
  healthinessSummary?: HealthinessSummaryInfo;
}

export interface FailuresSummaryInfo {
  topFailingTests: FailingTestInfo[];
  failureStats: FailureStats;
}

export interface FailingTestInfo {
  displayName: string;
  failCount: number;
  passTimestamp: string;
  failTimestamp: string;
}

export interface FailureStats {
  numFailingTests: number;
}

export interface HealthinessSummaryInfo {
  topFlakyTests: FlakyTestInfo[];
  healthinessStats: HealthinessStats;
}

export interface FlakyTestInfo {
  displayName: string;
  flakiness: number;
}

export interface HealthinessStats {
  startTimestamp: string;
  endTimestamp: string;
  numFlakyTests: number;
  averageFlakiness: number;
  previousFlakiness: number;
}

// TODO: define in a shared file (dashboard group also uses this)
export const TabStatusIcon = new Map<string, string>([
  ['PASSING', 'done'],
  ['FAILING', 'warning'],
  ['FLAKY', 'remove_circle_outline'],
  ['STALE', 'error_outline'],
  ['BROKEN', 'broken_image'],
  ['PENDING', 'schedule'],
  ['ACCEPTABLE', 'add_circle_outline'],
]);

// TODO: generate the correct time representation
function convertResponse(ts: TabSummary) {
  const tsi: TabSummaryInfo = {
    icon: TabStatusIcon.get(ts.overallStatus)!,
    name: ts.tabName,
    overallStatus: ts.overallStatus,
    detailedStatusMsg: ts.detailedStatusMessage,
    lastUpdateTimestamp: Timestamp.toDate(
      ts.lastUpdateTimestamp!
    ).toISOString(),
    lastRunTimestamp: Timestamp.toDate(ts.lastRunTimestamp!).toISOString(),
    latestGreenBuild: ts.latestPassingBuild,
    dashboardName: ts.dashboardName,
  };
  if (ts.failuresSummary !== undefined) {
    tsi.failuresSummary = {} as FailuresSummaryInfo
    const failureStats: FailureStats = {
      numFailingTests: ts.failuresSummary!.failureStats!.numFailingTests,
    }
    tsi.failuresSummary!.failureStats = failureStats

    tsi.failuresSummary!.topFailingTests = [];
    ts.failuresSummary?.topFailingTests.forEach( (test, i) => {
    const failingTest: FailingTestInfo = {
      displayName: test.displayName,
      failCount: test.failCount,
      passTimestamp: Timestamp.toDate(test.passTimestamp!).toISOString(),
      failTimestamp: Timestamp.toDate(test.failTimestamp!).toISOString(),
    }
    tsi.failuresSummary!.topFailingTests.push(failingTest)
    });
  }

  if (ts.healthinessSummary !== undefined) {
    tsi.healthinessSummary = {} as HealthinessSummaryInfo
    const healthinessStats: HealthinessStats = {
      startTimestamp: Timestamp.toDate(ts.healthinessSummary!.healthinessStats!.start!).toISOString(),
      endTimestamp: Timestamp.toDate(ts.healthinessSummary!.healthinessStats!.end!).toISOString(),
      numFlakyTests: ts.healthinessSummary!.healthinessStats!.numFlakyTests,
      averageFlakiness: ts.healthinessSummary!.healthinessStats!.averageFlakiness,
      previousFlakiness: ts.healthinessSummary!.healthinessStats!.previousFlakiness,
    }
    tsi.healthinessSummary!.healthinessStats = healthinessStats

    tsi.healthinessSummary!.topFlakyTests = [];
    ts.healthinessSummary?.topFlakyTests.forEach( test => {
      const flakyTest: FlakyTestInfo = {
        displayName: test.displayName,
        flakiness: test.flakiness,
      }
      tsi.healthinessSummary!.topFlakyTests.push(flakyTest)
    })
  }
  return tsi;
}

/**
 * Class definition for the `testgrid-dashboard-summary` element.
 * Renders the dashboard summary (summary of dashboard tabs).
 */
@customElement('testgrid-dashboard-summary')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TestgridDashboardSummary extends LitElement {

  @property()
  dashboardName: string = '';

  @state()
  tabSummariesInfo: Array<TabSummaryInfo> = [];

  connectedCallback(){
    super.connectedCallback();
    this.fetchTabSummaries();
  }

  /**
   * Lit-element lifecycle method.
   * Invoked on each update to perform rendering tasks.
   */
  render() {
    return html`
      ${map(
      this.tabSummariesInfo,
      (ts: TabSummaryInfo) => html`<tab-summary .info=${ts}></tab-summary>`
    )}
  `;
  }

  // fetch the tab summaries and tab names to populate the tab bar
  private async fetchTabSummaries() {
    try {
      const response = await fetch(
        `http://${process.env.API_HOST}:${process.env.API_PORT}/api/v1/dashboards/${this.dashboardName}/tab-summaries`
      );
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = ListTabSummariesResponse.fromJson(await response.json(), {ignoreUnknownFields: true});
      const tabSummaries: Array<TabSummaryInfo> = [];
      data.tabSummaries.forEach(ts => {
        const si = convertResponse(ts);
        tabSummaries.push(si);
      });
      this.tabSummariesInfo = tabSummaries;
    } catch (error) {
      console.error(`Could not get dashboard summaries: ${error}`);
    }
  }
}
