import {
  html,
  fixture,
  defineCE,
  unsafeStatic,
  expect,
  waitUntil,
  aTimeout,
} from '@open-wc/testing';

import { TestgridRouter } from '../src/testgrid-router.js';
import { navigate } from '../src/utils/navigation.js';

describe('Testgrid Router navigation', () => {
  let element: TestgridRouter;

  beforeEach(async () => {
    // Ensure we start from root
    window.history.replaceState(null, '', '/');

    const tagName = defineCE(class extends TestgridRouter {});
    const tag = unsafeStatic(tagName);
    element = await fixture(html`<${tag}></${tag}>`);
  });

  it('renders the index at root and returns to it with history.back()', async () => {
    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-index'),
      'Router did not render the index at root',
      { timeout: 4000 }
    );
    expect(window.location.pathname).to.equal('/');

    navigate('fake-dashboard-1');

    await waitUntil(
      () => element.shadowRoot!.querySelector('testgrid-summary'),
      'Router did not navigate to dashboard route',
      { timeout: 4000 }
    );
    expect(window.location.pathname).to.equal('/fake-dashboard-1');

    window.history.back();
    await aTimeout(0);

    await waitUntil(
      () =>
        window.location.pathname === '/' &&
        !!element.shadowRoot!.querySelector('testgrid-index'),
      'Router did not navigate back to root and render index',
      { timeout: 4000 }
    );
  });
});

