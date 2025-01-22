import {
  expect,
} from '@open-wc/testing';
import {
  TestGridLinkTemplate,
  substitute,
} from '../../src/utils/link-template';

describe('Link template', () => {
  it('returns url', async () => {
    const template: TestGridLinkTemplate = {
      url: new URL('https://prow.k8s.io'),
    };
    expect(substitute(template)).to.equal(template.url);
  });
});
