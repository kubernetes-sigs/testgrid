import {createContext} from '@lit/context';
import { TestGridLinkTemplate } from './utils/link-template';

export { TestGridLinkTemplate } from './utils/link-template';
export const linkContext = createContext<TestGridLinkTemplate>('testgrid-link-context');
