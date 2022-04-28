import {LitElement, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {observeState} from 'lit-element-state';

import {app} from '../../state/app.js';

@customElement('river-data-select-series')
class RiverDataSelectSeries extends observeState(LitElement) {
  @state() category;

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.category = "datainfo";
  }

  firstUpdated() {
    var elems = this.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {constrainWidth: false});
  }

  selected(category, series) {
    this.category = category;
    app.selectedSeries = series;
  }


  render() {
    return html`
      <button class="btn waves-effect waves-light" ?active=${this.category == 'datainfo'} 
        @click="${() => this.selected('datainfo', 'datainfo')}" id="datainfo">Data Info</button>

      <a class="btn dropdown-trigger" ?active=${this.category == 'gage'} data-target="gage">
        Gage<i class="material-icons right">arrow_drop_down</i></a>
      <ul id="gage" class="dropdown-content">
        <li><a @click="${() => this.selected('gage', 'flow')}" id="">Flow (cu ft/s)</a></li>
        <li><a @click="${() => this.selected('gage', 'height')}" id="">Height (ft)</a></li>
      </ul>

      <a class="btn dropdown-trigger" ?active=${this.category == 'env'} data-target="env">
        Environmental<i class="material-icons right">arrow_drop_down</i></a>
      <ul id="env" class="dropdown-content">
        <!-- <li><a @click="${() => this.selected('env', 'turbidity')}" id="turbidity">Turbidity</a></li> -->
        <li><a @click="${() => this.selected('env', 'temp')}" id="">Temperature</a></li>
        <li><a @click="${() => this.selected('env', 'spc')}" id="">Specific Conductance</a></li>
        <li><a @click="${() => this.selected('env', 'do')}" id="">Disolved Oxygen</a></li>
        <li><a @click="${() => this.selected('env', 'tds')}" id="">Total Dissolved Solids</a></li>
        <li><a @click="${() => this.selected('env', 'tss')}" id="">Total Suspended Solids</a></li>

        <li class="divider" tabindex="-1"></li>

        <li><a @click="${() => this.selected('env', 'ecoli')}" id="">E. Coli</a></li>

        <li class="divider" tabindex="-1"></li>

        <li><a @click="${() => this.selected('env', 'nitrates')}" id="">Nitrates</a></li>
        <li><a @click="${() => this.selected('env', 'phosphorus')}" id="">Phosphorus</a></li>
        <li><a @click="${() => this.selected('env', 'chlorides')}" id="">Chlorides</a></li>
        <li><a @click="${() => this.selected('env', 'ph')}" id="">pH</a></li>
      </ul>
    `;
  }
}

