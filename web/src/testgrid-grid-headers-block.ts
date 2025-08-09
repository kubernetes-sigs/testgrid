import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { ListHeadersResponse } from './gen/pb/api/v1/data.js';
import { CombinedHeader } from './testgrid-grid-header-row.js';
import './testgrid-grid-header-row.js';

function runLengthEncode(values: string[]): CombinedHeader[] {
  if (values.length == 0) {
    return [];
  }

  const headers: CombinedHeader[] = [];
  let prev = values[0];
  let count = 1;
  for (let i = 1; i < values.length; i++) {
    const curr = values[i];
    if (prev == curr) {
      count++;
      continue;
    }
    headers.push({
      value: curr,
      count,
    });
    prev = curr;
    count = 1;
  }
  headers.push({
    value: prev,
    count,
  });
  return headers;
}

@customElement('testgrid-grid-headers-block')
export class TestgridGridHeadersBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: #eee;
      z-index: 10;
      width: fit-content;
      position: sticky;
      top: 0;
    }
  `;

  @property() headers: ListHeadersResponse;

  render() {
    const builds: string[] = [];
    const dates: string[] = [];
    const times: string[] = [];
    const extras: string[][] = [];
    for (const header of this.headers?.headers || []) {
      builds.push(header.build);
      for (let i = 0; i < header.extra.length; i++) {
        if (i >= extras.length) {
          extras[i] = [];
        }
        extras[i].push(header.extra[i]);
      }
      if (header.started == undefined) {
        // This really shouldn't happen, but set a default value anyway to make that clear.
        dates.push('-');
        times.push('-');
        continue;
      }
      const date = new Date(parseInt(header.started.seconds) * 1000);
      dates.push(
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      );
      times.push(
        date.toLocaleString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: 'numeric',
        })
      );
    }
    return html`
      <testgrid-grid-header-row
        .name="start date"
        .combinedHeaders="${runLengthEncode(dates)}"
      ></testgrid-grid-header-row>
      <testgrid-grid-header-row
        .name="start time"
        .combinedHeaders="${runLengthEncode(times)}"
      ></testgrid-grid-header-row>
      <testgrid-grid-header-row
        .name="build ID"
        .combinedHeaders="${runLengthEncode(builds)}"
      ></testgrid-grid-header-row>
      ${map(
        extras,
        extra =>
          html`<testgrid-grid-header-row
            .name="extra"
            .combinedHeaders="${runLengthEncode(extra)}"
          ></testgrid-grid-header-row>`
      )}
    `;
  }
}
