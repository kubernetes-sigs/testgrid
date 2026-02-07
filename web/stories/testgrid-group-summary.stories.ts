import { html, TemplateResult } from 'lit';
import '../src/testgrid-group-summary.js';

export default {
  title: 'Dashboard Group View',
  component: 'testgrid-group-summary',
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: T;
}

interface Args {
  groupName: string;
}

const Template: Story<Args> = ({ groupName = '' }: Args) => html` <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
  <testgrid-group-summary .groupName="${groupName}"></testgrid-group-summary>`;

export const DashboardGroup1 = Template.bind({});
DashboardGroup1.args = { groupName: 'fake-dashboard-group-1' };

export const DashboardGroup2 = Template.bind({});
DashboardGroup2.args = { groupName: 'fake-dashboard-group-2' };

export const DashboardGroup3 = Template.bind({});
DashboardGroup3.args = { groupName: 'fake-dashboard-group-3' };
