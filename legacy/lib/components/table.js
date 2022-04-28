import {LitElement, html} from 'lit';
import {customElement, queryAll, property} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';


import {observeState} from 'lit-element-state';

import * as d3 from "d3";


import {app} from '../state/app.js';
import {model} from '../data/model.js';

import {labels, formatValue} from "../data/definitions.js";


@customElement('river-table')
class RiverTable extends observeState(LitElement) {
  createRenderRoot() {
    return this;
  }

  siteSummaryTable() {
    if(app.selectedSites.length > 0) {
      let table = "";
      table = "<table class='striped' id='site-summary'>";
      table += '<thead><tr>' +
              '<th>Name</th>' +
              '<th>Sample Count</th>' +
              '<th>From</th>' +
              '<th>To</th></tr><tbody>';

      for(let i in app.selectedSites) {
        let site = app.selectedSites[i];
        let name = model.sites[site].siteName;
        let dates = model.sites[site].df.getSeries('date');

        table += `<tr><td>${name}</td><td class='count'>${dates.count()}</td><td>${dates.first()}</td><td>${dates.last()}</td></tr>`
      }

      table += '</tbody></table>';

      return table;
    } else {
      return "<i>No sites selected</i>"
    }
  }

  dataSummaryTable() {
    let table = "";

    if(app.selectedSites.length > 0) {
      table = "<table class='highlight'>";
      table += '<thead><tr><th>Variable</th>';
      if(app.selectedSites.length > 1) {
        table += '<th>Last value (mean)<th>';
      } else {
        table += '<th>Last value<th>';
      }

      table += '</tr></thead>'
      for(let series in labels) {
        var name = labels[series];

        let values = []
        for(let i in app.selectedSites) {
          let site = app.selectedSites[i];
          let val = model.getValue(site, series);
          if(val) {
            values.push(val);
          }
        }

        let mean = d3.mean(values);

        if(mean) {
          let tr = "<tr>";
          tr += "<td>" + name + "</td>";
          tr += "<td>" + formatValue(series, mean) + "</td></tr>";

          table += tr;
        }
      }
      table += "</table>";
      return table
    } else {
      return "<br/><i>Click sites to select</i>";
    }
  }

  render() {
    console.log('render table');

    // TODO: print table: | name | from date | to date |

    let height = app.viewportHeight - 64 - 4;
    if(app.showDataSelect || app.showTimeseries) {
      height = height - document.getElementsByTagName('river-data-select')[0].height;
    }

    const width = document.getElementsByTagName('river-data-select')[0].width;
    const style = `width: ${width}px; height: ${height}px;`

    return html`
      <div id="table" class="card" style="${style}">
      <h5>Data Summary</h5>
      ${unsafeHTML(this.siteSummaryTable())}
      ${unsafeHTML(this.dataSummaryTable())}
      </div>
    `;
  }
}