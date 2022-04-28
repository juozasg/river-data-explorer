import {LitElement, html} from 'lit';
import {customElement, query} from 'lit/decorators.js';

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

import {scales, labels} from "../../data/definitions.js";

import {measurementScaleLegend} from  '../../legend/scale.js';
import {measurementRadiusLegend, samplingFrequencyRadiusLegend} from  '../../legend/radius.js';
import {app} from '../../state/app.js';


@customElement('river-data-select-legend')
class RiverDataSelectLegend extends LitElement {
  @query('#legend') legendContainer;

  // no Shadow DOM
  createRenderRoot() {
    return this;
  }

  renderLegend() {
    console.log('renderLegend', app.selectedSeries);

    this.legendContainer.replaceChildren();

    let colorScale = scales[app.selectedSeries];

    // COLOR SCALE
    let scaleLegend = measurementScaleLegend(colorScale)
    this.legendContainer.appendChild(scaleLegend);

    let label;
    if(app.selectedSeries == 'datainfo') {
      label = document.createElement('h6');
      label.innerText = 'Days since last observation';
      label.setAttribute('class', 'datainfo-color-label');
      this.legendContainer.appendChild(label);
    }

    
    // RADIUS SCALE
    let radiusLegend;
    label = document.createElement('h6');

    if(app.selectedSeries == 'datainfo') {
      // data density is ordinal data [Y,M,...,RT] or [0,1,...,4]
      radiusLegend = samplingFrequencyRadiusLegend(colorScale);      
      label.innerText = 'Site sampling frequency';
    } else {
      radiusLegend = measurementRadiusLegend(colorScale);
      label.innerText = labels[app.selectedSeries];
    }

    this.legendContainer.appendChild(radiusLegend);
    this.legendContainer.appendChild(label);

    tippy('#legend .tippy', {
      zIndex: 10001
    });
  }

  render() {
    console.log('render legend WC', app.selectedSeries);
    return html`
      <div id="legend">Legend for ${app.selectedSeries}</div>
    `;
  }

  firstUpdated() {
    // lit-state DOES NOT LIKE deleting elements in update()
    // observe for changes manually
    app.addObserver(() => this.renderLegend(), ['selectedSeries'])
  }

  updated() {
    this.renderLegend();
  }
}

