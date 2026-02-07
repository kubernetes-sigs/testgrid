import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
  waitUntil,
} from '@open-wc/testing';

import { TestgridDataContent } from '../src/testgrid-data-content.js';

describe('Testgrid Data Content page', () => {
  let element: TestgridDataContent;
  beforeEach(async () => {
    // Need to wrap an element to apply its properties (ex. @customElement)
    // See https://open-wc.org/docs/testing/helpers/#test-a-custom-class-with-properties
    const tagName = defineCE(class extends TestgridDataContent {});
    const tag = unsafeStatic(tagName);
    element = await fixture(
      html`<${tag} .dashboardName=${'fake-dashboard-1'}></${tag}>`
    );
  });

  it('fetches the tab names', async () => {
    await waitUntil(
      () => element.tabNames.length > 0,
      'Data content did not fetch tab names',
      {
        timeout: 4000,
      }
    );

    expect(element.tabNames).to.not.be.empty;
  });

  it('renders the dashboard summary if `showTab` is false', async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-dashboard-summary'),
      'Data content did not render the dashboard summary',
      {
        timeout: 4000,
      }
    );

    expect(element.showTab).to.equal(false);
    const dashboardSummary = element.shadowRoot!.querySelector('testgrid-dashboard-summary');
    expect(dashboardSummary).to.exist;
  });

  it('renders the grid display if `showTab` is true', async () => {
    element.showTab = true;
    element.tabName = 'fake-tab-1';
    await element.updateComplete;

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-grid'),
      'Data content did not render the grid',
      {
        timeout: 4000,
      }
    );

    const grid = element.shadowRoot!.querySelector('testgrid-grid');
    expect(grid).to.exist;
  });

  it('switches between summary and grid based on showTab', async () => {
    // Initially shows dashboard summary
    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-dashboard-summary'),
      'Data content did not render the dashboard summary',
      {
        timeout: 4000,
      }
    );
    expect(element.showTab).to.equal(false);

    // Switch to grid
    element.showTab = true;
    element.tabName = 'fake-tab-1';
    await element.updateComplete;

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-grid'),
      'Data content did not render the grid',
      {
        timeout: 4000,
      }
    );
    expect(element.shadowRoot!.querySelector('testgrid-dashboard-summary')).to.not.exist;

    // Switch back to summary
    element.showTab = false;
    await element.updateComplete;

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-dashboard-summary'),
      'Data content did not render the dashboard summary after switching back',
      {
        timeout: 4000,
      }
    );
    expect(element.shadowRoot!.querySelector('testgrid-grid')).to.not.exist;
  });
});
