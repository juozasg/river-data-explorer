import { LitState, stateVar } from 'lit-element-state';

import {model} from '../data/model.js';


class AppState extends LitState {
  @stateVar() showTable = false;
  @stateVar() showDataSelect = true;
  @stateVar() showTimeseries = true;

  @stateVar() selectedSeries = 'datainfo';
  // @stateVar() selectedSeries = 'tss';
  @stateVar() selectedSites = [];
  // @stateVar() selectedSites = ['elkhart-Horn-Ditch-CR-31', 'elkhart-Elkhart-River-CR-43'];

  @stateVar() viewportWidth = window.innerWidth;
  @stateVar() viewportHeight = window.innerHeight;

  // {series: 'ph', sites: ['elkhart-001',...]}
  @stateVar() leftTimeseries = {}
  @stateVar() rightTimeseries = {}


  constructor() {
    super();

    window.addEventListener('resize', () => this.updateViewportSize());
  }

  updateViewportSize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
    console.log(this.viewportWidth, this.viewportHeight);
  }

  toggleSiteSelection(siteId) {
    console.log('select site', siteId);
    let sites = _(this.selectedSites);
    if(sites.includes(siteId)) {
      this.selectedSites = sites.pull(siteId).clone();
    } else {
      this.selectedSites = sites.concat(siteId).clone();
    }
  }

  siteIsSelected(siteId) {
    return _(this.selectedSites).includes(siteId);
  }

  clearSelection() {
    this.selectedSites = [];
  }

  buildTimeseries() {
    return {
      seriesId: this.selectedSeries,
      siteIds: [...this.selectedSites],
      series: model.sitesMeanSeries(this.selectedSeries, this.selectedSites)
    };
  }


  setLeftTimeseries() {
    this.leftTimeseries = this.buildTimeseries();
  }

  setRightTimeseries() {
    this.rightTimeseries = this.buildTimeseries();
  }
}

export const app = new AppState();

window.app = app;
