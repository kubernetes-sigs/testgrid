import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
  waitUntil,
} from '@open-wc/testing';

import { Tab } from '@material/mwc-tab';
import { TestgridDataContent } from '../src/testgrid-data-content';

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

  // TODO - add accessibility tests
  // TODO - add tests for tab switching behaviour
  it('fetches the tab names and renders the tab bar', async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector('mwc-tab-bar'),
      'Data content did not render the tab bar',
      {
        timeout: 4000,
      }
    );

    expect(element.tabNames).to.not.be.empty;
  });

  it('renders the dashboard summary if `showTab` attribute is not passed', async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector('mwc-tab-bar'),
      'Data content did not render the tab bar',
      {
        timeout: 4000,
      }
    );

    expect(element.tabNames).to.not.be.empty;
    expect(element.activeIndex).to.equal(0);
    expect(window.location.pathname).to.equal('/');
  });

  it('renders the grid display if a tab is clicked', async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector('mwc-tab'),
      'Data content did not render the tab bar',
      {
        timeout: 4000,
      }
    );

    const tab: NodeListOf<Tab> | null =
      element.shadowRoot!.querySelectorAll('mwc-tab');
    tab[1]!.click();

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-grid'),
      'Data content did not render the grid data',
      {
        timeout: 4000,
      }
    );

    expect(element.activeIndex).to.equal(1);
    expect(element.showTab).to.equal(true);
    expect(window.location.pathname).to.equal('/fake-dashboard-1/fake-tab-1');
  });

  it('renders the grid display, then dashboard summary when clicked', async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector('mwc-tab-bar'),
      'Data content did not render the tab bar',
      {
        timeout: 4000,
      }
    );

    const tab: NodeListOf<Tab> | null =
      element.shadowRoot!.querySelectorAll('mwc-tab');
    tab[1]!.click();

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-grid'),
      'Data content did not render the grid data',
      {
        timeout: 4000,
      }
    );

    expect(element.activeIndex).to.equal(1);
    expect(element.showTab).to.equal(true);
    expect(window.location.pathname).to.equal('/fake-dashboard-1/fake-tab-1');

    tab[0]!.click();

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-dashboard-summary'),
      'Data content did not render the dashboard summary',
      {
        timeout: 4000,
      }
    );

    expect(element.activeIndex).to.equal(0);
    expect(element.showTab).to.equal(false);
    expect(window.location.pathname).to.equal('/fake-dashboard-1');
  });
});
