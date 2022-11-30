import { model } from  "./model";

import { fetchJSON, fetchText } from "./loader";

import { leftSeries, rightSeries } from "../stores";

import strftime from "../strftime";
import { oneMonthAgo } from "../helpers";

const  usgsStationIds = '04096405,04096515,04097500,040975299,04097540,04099000,04100500,04101000,04101500,04101535,04101800,04102500,04099750';
// const  usgsStationIds = '04099750';


export async function loadUSGS() {
  try {
    let siteData = await loadSites();
    model.importUSGSSites(siteData);

    let seriesData = await loadSeries();
    model.processUSGSSeriesData(seriesData);
  } catch(e) {
    console.error(e);
    throw e;
  } finally {
    leftSeries.set('height');
    rightSeries.set('flow');
  }
}

async function loadSites() {
  const url = `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${usgsStationIds}&siteStatus=all`;
  return fetchJSON(url);
}

async function loadSeries() {
  const startDate = '2000-01-01';
  const monthAgoDate = strftime('%F', new Date(oneMonthAgo()));
  const nowDate = strftime('%F', new Date(Date.now()));

  const dailiesUrl = `https://waterservices.usgs.gov/nwis/dv/?format=rdb&sites=${usgsStationIds}&statCd=00003&siteStatus=all&startDT=${startDate}&endDT=${monthAgoDate}`;
  const ivUrl = `https://waterservices.usgs.gov/nwis/iv/?format=rdb&sites=${usgsStationIds}&parameterCd=00060,00065&siteStatus=all&startDT=${monthAgoDate}&endDT=${nowDate}`;

  const loadDailies = fetchText(dailiesUrl);
  const loadIV = fetchText(ivUrl);

  return Promise.all([loadDailies, loadIV]).then((results) => {
    return results[0] + "\n" + results[1]
  });

}


