import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
  waitUntil,
} from '@open-wc/testing';

import { TestgridDashboardSummary } from '../src/testgrid-dashboard-summary.js';
import { TabSummary } from '../src/tab-summary.js';

describe('Testgrid Dashboard Summary page', () => {
  let element: TestgridDashboardSummary;
  beforeEach(async () => {
    // Need to wrap an element to apply its properties (ex. @customElement)
    // See https://open-wc.org/docs/testing/helpers/#test-a-custom-class-with-properties
    const tagName = defineCE(class extends TestgridDashboardSummary {});
    const tag = unsafeStatic(tagName);
    element = await fixture(
      html`<${tag} .dashboardName=${'fake-dashboard-1'}></${tag}>`
    );
  });

  // TODO - add accessibility tests
  it('renders the tab summaries', async () => {
    // waiting until list items (dashboards and groups) are fully rendered
    await waitUntil(
      () => element.shadowRoot!.querySelector('tab-summary'),
      'Dashboard summary did not render tab summaries',
      {
        timeout: 4000,
      }
    );

    expect(element.tabSummariesInfo.length).to.equal(4);
    expect(element.tabSummariesInfo[0].name).to.equal('fake-tab-1');
    expect(element.tabSummariesInfo[0].overallStatus).to.equal('PASSING');
    expect(
      element.tabSummariesInfo[0].failuresSummary?.failureStats.numFailingTests
    ).to.equal(1);
    expect(
      element.tabSummariesInfo[0].failuresSummary?.topFailingTests[0].failCount
    ).to.equal(1);
    expect(
      element.tabSummariesInfo[0].failuresSummary?.topFailingTests[0]
        .displayName
    ).to.equal('fake-test-1');
    expect(
      element.tabSummariesInfo[0].healthinessSummary?.topFlakyTests[0]
        .displayName
    ).to.equal('fake-test-2');
    expect(
      element.tabSummariesInfo[0].healthinessSummary?.topFlakyTests[0].flakiness
    ).to.equal(2);
    expect(
      element.tabSummariesInfo[0].healthinessSummary?.healthinessStats
        .numFlakyTests
    ).to.equal(2);

    const tabSummaries: NodeListOf<TabSummary> =
      element.shadowRoot!.querySelectorAll('tab-summary');
    await waitUntil(
      () =>
        tabSummaries[0]!.shadowRoot!.querySelector(
          'testgrid-healthiness-summary'
        ),
      'Dashboard summary did not render healthiness summary',
      {
        timeout: 4000,
      }
    );

    await waitUntil(
      () =>
        tabSummaries[0]!.shadowRoot!.querySelector('testgrid-failures-summary'),
      'Dashboard summary did not render failures summary',
      {
        timeout: 4000,
      }
    );
  });

  it('show alerts when toggled', async () => {
    // waiting until list items (dashboards and groups) are fully rendered
    await waitUntil(
      () => element.shadowRoot!.querySelector('tab-summary'),
      'Dashboard summary did not render tab summaries',
      {
        timeout: 4000,
      }
    );

    const dropdowns: NodeListOf<HTMLDivElement> = element
      .shadowRoot!.querySelectorAll('tab-summary')[0]!
      .shadowRoot!.querySelector('testgrid-failures-summary')!
      .shadowRoot!.querySelectorAll('.dropdown-container');
    const table: HTMLTableElement | null = dropdowns[0]!.querySelector('table');
    expect(table).to.not.exist;

    // Show alerts.
    const buttons: NodeListOf<HTMLButtonElement> | null =
      dropdowns[0]!.querySelectorAll('button.btn');
    buttons[0]!.click();

    await waitUntil(
      () =>
        element
          .shadowRoot!.querySelectorAll('tab-summary')[0]!
          .shadowRoot!.querySelector('testgrid-failures-summary')!
          .shadowRoot!.querySelectorAll('.dropdown-container')[0]!
          .querySelector('table'),
      'Dashboard summary did not render healthiness table',
      {
        timeout: 4000,
      }
    );
  });

  it('show healthiness summary when toggled', async () => {
    // waiting until list items (dashboards and groups) are fully rendered
    await waitUntil(
      () => element.shadowRoot!.querySelector('tab-summary'),
      'Dashboard summary did not render tab summaries',
      {
        timeout: 4000,
      }
    );

    const dropdowns: NodeListOf<HTMLDivElement> = element
      .shadowRoot!.querySelectorAll('tab-summary')[0]!
      .shadowRoot!.querySelector('testgrid-healthiness-summary')!
      .shadowRoot!.querySelectorAll('.dropdown-container');
    const table: HTMLTableElement | null = dropdowns[0]!.querySelector('table');
    expect(table).to.not.exist;

    // Show healthiness summary.
    const buttons: NodeListOf<HTMLButtonElement> | null =
      dropdowns[0]!.querySelectorAll('button.btn');
    buttons[0]!.click();

    await waitUntil(
      () =>
        element
          .shadowRoot!.querySelectorAll('tab-summary')[0]!
          .shadowRoot!.querySelector('testgrid-healthiness-summary')!
          .shadowRoot!.querySelectorAll('.dropdown-container')[0]!
          .querySelector('table'),
      'Dashboard summary did not render healthiness table',
      {
        timeout: 4000,
      }
    );
  });
});
