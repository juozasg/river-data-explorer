import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import {observeState} from 'lit-element-state';


import {labels} from "../data/definitions.js";
import {model} from "../data/model.js";
import {app} from '../state/app.js';

@customElement('river-toolbar')
class RiverToolbar extends observeState(LitElement) {
  createRenderRoot() {
    return this;
  }

  render() {
    // TODO: someday fix this with nested flexbox or grid or such
    const ratio = window.visualViewport.width < 400 ? 18 : 15;
    const textWidth = parseInt(window.visualViewport.width / ratio);
    let sitesSelectedText = 'No sites selected';

    if(app.selectedSites.length == 1) {
      sitesSelectedText = model.sites[app.selectedSites[0]].siteName;
    } else if(app.selectedSites.length > 1) {
      sitesSelectedText = `${app.selectedSites.length} sites selected`;
    }

    sitesSelectedText = sitesSelectedText.slice(0, textWidth);

    const variableText = app.selectedSeries == 'datainfo' ? '' : ` &mdash; ${labels[app.selectedSeries]}`

    return html`
    <div id="toolbar-container">
      <div id="toolbar" class="card">
        <span @click="${() => alert('TODO: help and instructions')}"
          class="material-icons">help_outline</span>

        <span @click="${() => app.showTable = !app.showTable}"
          ?active=${app.showTable} class="material-icons">view_list</span>

        <span @click="${() => app.showDataSelect = !app.showDataSelect}"
          ?active=${app.showDataSelect} class="material-icons">filter_list</span>

        <span @click="${() => app.showTimeseries = !app.showTimeseries}"
          ?active=${app.showTimeseries} class="material-icons">timeline</span>

        <span id="status">
        <span @click="${() => app.clearSelection()}" ?show=${app.selectedSites.length > 0} class="selected-actions">
          <span class="material-icons clear-selection">clear</span>
        </span>

          <span class="text">${sitesSelectedText}${unsafeHTML(variableText)}</span>
          <span ?show=${app.selectedSeries != 'datainfo' && app.selectedSites.length > 0} class="selected-actions">
            <span @click="${() => app.setLeftTimeseries()}" class="material-icons add-to-left">arrow_left</span>
            <span class="material-icons timeline-hint">timeline</span>
            <span @click="${() => app.setRightTimeseries()}" class="material-icons add-to-right">arrow_right</span>
          <span>
        </span>
      </div>
    </div>
    `;
  }
}