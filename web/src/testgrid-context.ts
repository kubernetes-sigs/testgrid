import {createContext} from '@lit/context';
import { TestGridLinkTemplate } from './utils/link-template.js';

export { TestGridLinkTemplate } from './utils/link-template.js';
export const linkContext = createContext<TestGridLinkTemplate>('testgrid-link-context');
