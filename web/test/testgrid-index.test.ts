import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
} from '@open-wc/testing';

import { TestgridIndex } from '../src/testgrid-index.js';

describe('Testgrid Index page', () => {
  let element: TestgridIndex;
  beforeEach(async () => {
    const tagName = defineCE(class extends TestgridIndex { });
    const tag = unsafeStatic(tagName);
    element = await fixture(html`<${tag}></${tag}>`);
  });

  it('renders data and handles search', async () => {
    element.dashboardGroups = {
      'group-alpha': ['dashboard-1', 'dashboard-2'],
      'group-beta': ['dashboard-3']
    };
    element.ungroupedDashboards = ['standalone-dashboard'];
    await element.updateComplete;

    let cards = element.shadowRoot!.querySelectorAll('.grid-card');
    expect(cards).to.have.length(3); // 2 groups + 1 standalone

    const searchInput = element.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    searchInput.value = 'alpha';
    searchInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    cards = element.shadowRoot!.querySelectorAll('.grid-card');
    expect(cards).to.have.length(1);
    expect(cards[0].querySelector('.card-title')?.textContent).to.equal('group-alpha');

    searchInput.value = 'STANDALONE';
    searchInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    cards = element.shadowRoot!.querySelectorAll('.grid-card');
    expect(cards).to.have.length(1);
    expect(cards[0].querySelector('.card-title')?.textContent).to.equal('standalone-dashboard');
  });

  it('shows dashboard tooltips for groups', async () => {
    element.dashboardGroups = {
      'group-alpha': ['dashboard-1', 'dashboard-2'],
    };
    element.ungroupedDashboards = ['standalone-dashboard'];
    await element.updateComplete;

    const groupCard = element.shadowRoot!.querySelector('.grid-card.dashboard-group');
    expect(groupCard).to.exist;

    const tooltip = groupCard!.querySelector('.dashboard-tooltip');
    expect(tooltip).to.exist;

    const listItems = tooltip!.querySelectorAll('md-list-item');
    expect(listItems).to.have.length(2);

    const dashboardTexts = Array.from(listItems).map(item =>
      item.querySelector('p')?.textContent
    );
    expect(dashboardTexts).to.include('dashboard-1');
    expect(dashboardTexts).to.include('dashboard-2');

    const standaloneCard = element.shadowRoot!.querySelector('.grid-card:not(.dashboard-group)');
    expect(standaloneCard).to.exist;
    expect(standaloneCard!.querySelector('.dashboard-tooltip')).to.not.exist;
  });
});
