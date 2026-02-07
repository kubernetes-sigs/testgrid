import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
  waitUntil,
} from '@open-wc/testing';

import { TestgridGroupSummary } from '../src/testgrid-group-summary.js';

describe('Testgrid Group Summary page', () => {
  let element: TestgridGroupSummary;
  beforeEach(async () => {
    // Need to wrap an element to apply its properties (ex. @customElement)
    // See https://open-wc.org/docs/testing/helpers/#test-a-custom-class-with-properties
    const tagName = defineCE(class extends TestgridGroupSummary {});
    const tag = unsafeStatic(tagName);
    element = await fixture(
      html`<${tag} .groupName=${'fake-dashboard-group-1'}></${tag}>`
    );
  });

  // TODO - add accessibility tests
  it('renders the card grid with dashboard summaries', async () => {
    // wait for dashboard summary cards to be fully rendered
    await waitUntil(
      () => element.shadowRoot!.querySelector('md-outlined-card'),
      'Group summary did not render dashboard cards',
      {
        timeout: 4000,
      }
    );

    expect(element.dashboardSummaries.length).to.be.equal(3);

    // verify structured data for first dashboard (fake-dashboard-1: 2 PASSING, 1 FLAKY, 1 FAILING)
    expect(element.dashboardSummaries[0].passingTabs).to.equal(2);
    expect(element.dashboardSummaries[0].totalTabs).to.equal(4);
    expect(element.dashboardSummaries[0].statusBreakdown).to.deep.include({
      status: 'PASSING',
      count: 2,
      color: 'var(--tg-status-pass)',
    });
    expect(element.dashboardSummaries[0].statusBreakdown).to.deep.include({
      status: 'FLAKY',
      count: 1,
      color: 'var(--tg-status-flaky)',
    });
    expect(element.dashboardSummaries[0].statusBreakdown).to.deep.include({
      status: 'FAILING',
      count: 1,
      color: 'var(--tg-status-fail)',
    });

    // verify second dashboard (fake-dashboard-2: 1 PASSING, 1 ACCEPTABLE, 1 FLAKY)
    expect(element.dashboardSummaries[1].passingTabs).to.equal(1);
    expect(element.dashboardSummaries[1].totalTabs).to.equal(3);

    // verify third dashboard (fake-dashboard-3: 2 PASSING)
    expect(element.dashboardSummaries[2].passingTabs).to.equal(2);
    expect(element.dashboardSummaries[2].totalTabs).to.equal(2);

    // verify overall summary
    expect(element.overallSummary.totalPassing).to.equal(5);
    expect(element.overallSummary.totalTabs).to.equal(9);
    expect(element.overallSummary.totalDashboards).to.equal(3);

    // verify statusAggregates
    expect(element.overallSummary.statusAggregates).to.have.lengthOf(4);
    expect(element.overallSummary.statusAggregates).to.deep.include({
      status: 'PASSING',
      count: 5,
      color: 'var(--tg-status-pass)',
    });
    expect(element.overallSummary.statusAggregates).to.deep.include({
      status: 'ACCEPTABLE',
      count: 1,
      color: 'var(--tg-status-acceptable)',
    });
    expect(element.overallSummary.statusAggregates).to.deep.include({
      status: 'FLAKY',
      count: 2,
      color: 'var(--tg-status-flaky)',
    });
    expect(element.overallSummary.statusAggregates).to.deep.include({
      status: 'FAILING',
      count: 1,
      color: 'var(--tg-status-fail)',
    });
  });
});
