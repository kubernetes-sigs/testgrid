import { html } from 'lit';
import '../src/testgrid-status-indicator.js';

export default {
  title: 'Components/TestgridStatusIndicator',
  component: 'testgrid-status-indicator'
};

export const AllStatuses = () => html`
  <div
    style="display: flex; flex-direction: column; gap: 16px; font-family: Arial, sans-serif;"
  >
    <h3>All Status Indicators</h3>
    <div
      style="display: grid; grid-template-columns: 150px 1fr; gap: 12px; align-items: center;"
    >
      <span>PASSING:</span>
      <testgrid-status-indicator status="PASSING"></testgrid-status-indicator>

      <span>FAILING:</span>
      <testgrid-status-indicator status="FAILING"></testgrid-status-indicator>

      <span>FLAKY:</span>
      <testgrid-status-indicator status="FLAKY"></testgrid-status-indicator>

      <span>STALE:</span>
      <testgrid-status-indicator status="STALE"></testgrid-status-indicator>

      <span>BROKEN:</span>
      <testgrid-status-indicator status="BROKEN"></testgrid-status-indicator>

      <span>PENDING:</span>
      <testgrid-status-indicator status="PENDING"></testgrid-status-indicator>

      <span>ACCEPTABLE:</span>
      <testgrid-status-indicator
        status="ACCEPTABLE"
      ></testgrid-status-indicator>

      <span>Unknown/Default:</span>
      <testgrid-status-indicator status="UNKNOWN"></testgrid-status-indicator>
    </div>
  </div>
`;

export const InlineUsage = () => html`
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Status indicators can be used inline with text:</p>
    <p>
      Test suite is currently
      <testgrid-status-indicator status="PASSING"></testgrid-status-indicator>
      passing.
    </p>
    <p>
      Build status:
      <testgrid-status-indicator status="FAILING"></testgrid-status-indicator>
      failing with errors.
    </p>
    <p>
      Integration tests are
      <testgrid-status-indicator status="FLAKY"></testgrid-status-indicator>
      flaky.
    </p>
  </div>
`;
