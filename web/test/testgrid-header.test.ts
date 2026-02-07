import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
  waitUntil,
} from '@open-wc/testing';

import { TestgridHeader } from '../src/testgrid-header.js';

describe('Testgrid Header', () => {
  let element: TestgridHeader;
  beforeEach(async () => {
    const tagName = defineCE(class extends TestgridHeader {});
    const tag = unsafeStatic(tagName);
    element = await fixture(html`<${tag}></${tag}>`);
  });

  it('renders the header with logo and search input', async () => {
    const logo = element.shadowRoot!.querySelector('.logo');
    expect(logo).to.exist;
    expect(logo!.textContent).to.include('TestGrid');

    const searchInput = element.shadowRoot!.querySelector('.search-input');
    expect(searchInput).to.exist;
  });

  it('shows search results when typing a query', async () => {
    // Wait for dashboards to load
    await waitUntil(
      () => (element as any).dashboards !== null,
      'Dashboards did not load',
      { timeout: 4000 }
    );

    const searchInput = element.shadowRoot!.querySelector(
      '.search-input'
    ) as HTMLInputElement;
    expect(searchInput).to.exist;

    // Type a search query
    searchInput.value = 'fake';
    searchInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    // Wait for search results to appear
    await waitUntil(
      () => element.shadowRoot!.querySelector('.search-results'),
      'Search results did not appear',
      { timeout: 4000 }
    );

    const results = element.shadowRoot!.querySelectorAll('.search-result-item');
    expect(results.length).to.be.greaterThan(0);
  });

  it('shows no results message for non-matching query', async () => {
    // Wait for dashboards to load
    await waitUntil(
      () => (element as any).dashboards !== null,
      'Dashboards did not load',
      { timeout: 4000 }
    );

    const searchInput = element.shadowRoot!.querySelector(
      '.search-input'
    ) as HTMLInputElement;
    expect(searchInput).to.exist;

    // Type a non-matching query
    searchInput.value = 'zzzznonexistent';
    searchInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    // Wait for search results container to appear
    await waitUntil(
      () => element.shadowRoot!.querySelector('.search-results'),
      'Search results container did not appear',
      { timeout: 4000 }
    );

    const emptyMessage = element.shadowRoot!.querySelector(
      '.search-result-empty'
    );
    expect(emptyMessage).to.exist;
    expect(emptyMessage!.textContent).to.include('No results found');
  });

  it('hides search results when Escape is pressed', async () => {
    // Wait for dashboards to load
    await waitUntil(
      () => (element as any).dashboards !== null,
      'Dashboards did not load',
      { timeout: 4000 }
    );

    const searchInput = element.shadowRoot!.querySelector(
      '.search-input'
    ) as HTMLInputElement;

    // Type a search query
    searchInput.value = 'fake';
    searchInput.dispatchEvent(new Event('input'));
    await element.updateComplete;

    // Wait for search results to appear
    await waitUntil(
      () => element.shadowRoot!.querySelector('.search-results'),
      'Search results did not appear',
      { timeout: 4000 }
    );

    // Press Escape
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await element.updateComplete;

    // Results should be hidden
    const results = element.shadowRoot!.querySelector('.search-results');
    expect(results).to.not.exist;
  });
});
