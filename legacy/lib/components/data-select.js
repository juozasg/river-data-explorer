import {LitElement, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {HideReflowsController} from './controllers/hide-reflows.js'

import './data-select/series.js';
import './data-select/temporal.js';
import './data-select/legend.js';

@customElement('river-data-select')
class RiverDataSelect extends LitElement {
  //hideReflows = new HideReflowsController(this);

  // @property({type: Object}) fromDate; // Date object
  // @property({type: Object}) toDate;

  width = 464;
  height = 292;

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    //this.hideReflows.slideDown();
  }

  render() {
    let style = `width: ${this.width}px; height: ${this.height}px;`
    return html`

    <div class="card" id="data-select" style="${style}">
      <river-data-select-series></river-data-select-series>
      <!-- <river-data-select-temporal></river-data-select-temporal> -->
      <river-data-select-legend></river-data-select-legend>
    </div>
    `;
  }
}

