import {FeatureLayer, Query} from "esri-leaflet";

import {model} from  "../../data/model.js";

import strftime from "../../util/strftime.js"
import {oneMonthAgo} from "../../util/data-helpers.js"

// used by river-map to fetch and load the datasets and control the loading screen
export class DataController {
  usgsStationIds = '04096405,04096515,04097500,040975299,04097540,04099000,04100500,04101000,04101500,04101535,04101800,04102500,04099750';

  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  async load() {
    const loaders = []
    loaders.push(
      this.loadUSGSSites()
        .then(d => model.processUSGSSites(d))
        .then(() => this.loadUSGSSiteData())
        .then(d => model.processUSGSSiteData(d))
        .then(() => this.host.loading.loadedUSGS = true)
        // .then(() => model.printStatistics())
        .catch(e => this.host.loading.failure(e)));

    loaders.push(
      this.loadElkhart()
      .then(d => model.processElkhart(d))
      .then(() => this.host.loading.loadedElkhart = true)
      .catch(e => this.host.loading.failure(e)));

      // this.host.loading.loadedUSGS = true;
      // this.host.loading.loadedElkhart = true;

    Promise.all(loaders)
    .then(() => model.sortByDate())
    .then(() => this.host.modelToLayers());
  }

  async fetchAndParse(url, json) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        if(json) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .catch(e => {throw new Error(`Failed to load: ${url}\nbecause ${e.message}`)});
  }

  async fetchJSON(url) {
    return this.fetchAndParse(url, true);
  }

  async fetchText(url) {
    return this.fetchAndParse(url, false);
  }

  async loadUSGSSites() {
    const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${this.usgsStationIds}&siteStatus=all`;
    return this.fetchJSON(url);
  }

  async loadUSGSSiteData() {
    const startDate = '2000-01-01';
    const monthAgoDate = strftime('%F', new Date(oneMonthAgo()));
    const nowDate = strftime('%F', new Date(Date.now()));

    const dailiesUrl = `https://waterservices.usgs.gov/nwis/dv/?format=rdb&sites=${this.usgsStationIds}&statCd=00003&siteStatus=all&startDT=${startDate}&endDT=${monthAgoDate}`;
    const ivUrl = `https://waterservices.usgs.gov/nwis/iv/?format=rdb&sites=${this.usgsStationIds}&parameterCd=00060,00065&siteStatus=all&startDT=${monthAgoDate}&endDT=${nowDate}`;

    const loadDailies = this.fetchText(dailiesUrl);
    const loadIV = this.fetchText(ivUrl);

    return Promise.all([loadDailies, loadIV]).then((results) => {
      return results[0] + "\n" + results[1]
    });

  }

  async loadElkhart() {
    // const featureService = "https://services1.arcgis.com/fe2kKd3pQJKqve16/arcgis/rest/services/HistoricMonitoringSites/FeatureServer/0";
    const featureService = "https://services1.arcgis.com/fe2kKd3pQJKqve16/arcgis/rest/services/ElkhartTest1/FeatureServer/0";

    return new Promise((resolve, reject) => {
      new Query({
        url: featureService,
        // limit: 5
      }).run((error, featureCollection, response) => {
        if(error) {
          reject(new Error(`Failed to load: ${featureService}\nbecause ${JSON.stringify(error)}`));
        } else {
          resolve(featureCollection);
        }
      });
    });
  }
}
