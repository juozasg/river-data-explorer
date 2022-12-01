import * as df from 'data-forge';
import Papa from 'papaparse';

import { getSite, setSite } from '../stores';
import type { Site } from '../stores';
import { tzAbbr } from './tzAbbr';
import { labels } from '../definitions';
import { betweenDays, groupBy, getSetFirst, chunkUsgsResponse } from '../helpers';
import strftime from '../strftime';

type DframeMap = {
  [key: string]: df.IDataFrame;
}

let dframes: DframeMap = {};
window['dframes'] = dframes;

const siteDataset = siteId => siteId.replace(/-\d+$/, '');


function siteRowsToDatasets(rows): string[] {
  return Array.from(new Set(rows.map(r => siteDataset(r['siteId']))));
}


class Model {
  registerSite(site: Site) {
    // console.log(site);
    setSite(site);
    dframes[site.id] = new df.DataFrame({columnNames: ['date'], rows: []}).setIndex('date');
  }

  sortDataFrames() {
    for (const siteId of Object.keys(dframes)) {
      dframes[siteId] = dframes[siteId].orderBy(row => row.date).bake();
    }
  }

  updateSitesDataInfo() {
    this.sortDataFrames();

    // calculate datainfo
    let now = new Date(Date.now());
    for (const siteId of Object.keys(dframes)) {
      let site = getSite(siteId);
      const dateIndex = dframes[siteId].getIndex();

      if(site.dataset !== 'usgs' && dateIndex.count() > 1) {
        // console.log('debug datainfo', siteId,
        // new Date(dateIndex.first()).toLocaleDateString(),
        // new Date(dateIndex.last()).toLocaleDateString(),
        // 'days to today', betweenDays(new Date(dateIndex.last()), now),
        // 'inbetween days', betweenDays(new Date(dateIndex.first()), new Date(dateIndex.last())));

        site.observationDaysSinceLast = betweenDays(new Date(dateIndex.last()), now);

        const daysRange = betweenDays(new Date(dateIndex.first()), new Date(dateIndex.last()));
        const observationInterval = daysRange / dateIndex.count();

        if(observationInterval <= 1 ) {
          site.observationFrequency = 'RT';
        } else if(observationInterval < 7) {
          site.observationFrequency = 'D';
        } else if(observationInterval < 30) {
          site.observationFrequency = 'W';
        } else if(observationInterval < 60) {
          site.observationFrequency = 'M';
        } else {
          site.observationFrequency = 'Y';
        }

        setSite(site);
      }
    }
  }

  getValue(siteId: string, seriesId: string) {
    if(seriesId === 'datainfo') {
      // console.log(getSite(siteId), getSite(siteId)?.observationDaysSinceLast);

      return getSite(siteId)?.observationDaysSinceLast;
    } else {
      try {
        return dframes[siteId].getSeries(seriesId).bake().last();
      } catch(error) {
        return undefined;
      }
    }
  }

  getValueDate(siteId: string, seriesId: string) {
    if(seriesId === 'datainfo') {
      return Date.now();
    } else {
      try {
        return dframes[siteId].getSeries(seriesId).bake().getIndex().last();
      } catch(error) {
        return undefined;
      }
    }
  }

  getSitesTimeseries(sites: Set<string>, seriesId) {
    if(sites.size == 0) {
      return new df.Series();
    } else {
      const siteId = getSetFirst(sites);
      return dframes[siteId]?.getSeries(seriesId);
    }
  }


  getDframe(siteId: string): df.IDataFrame {
    return dframes[siteId];
  }


  // siteId,name,current,lat,lon
  // ecoli-1,ANGELA,yes,41.693199,-86.263052
  importSJRBCSites(sitesCsv: string): string[] {
    let rows: any[] = Papa.parse(sitesCsv, {
      delimiter: ",",
      comments: "#",
      header: true,
      skipEmptyLines: 'greedy'
    }).data;


    rows.forEach((row, i) => {
      let site = {} as Site;

      site.id = row.siteId;
      site.dataset = siteDataset(site.id);


      site.lat = parseFloat(row.lat);
      site.lon = parseFloat(row.lon);
      site.name = row.name;
      // TODO: recalculate this after all data is loaded
      site.observationFrequency = 'Y',
      site.observationDaysSinceLast = 365;

      if(!site.id || !site.lat || !site.lon) {
        console.log(`skip bad sites row #${i+1}`, row);
      } else {
        this.registerSite(site);
      }
    });

    return siteRowsToDatasets(rows);
  }

  async processSJRBCSeriesData(dataCsv: string) {
    let rows: any[] = Papa.parse(dataCsv, {
      delimiter: ",",
      comments: "#",
      header: true,
      skipEmptyLines: 'greedy'
    }).data;

    // filter by known series
    rows.forEach(r => {
      r['date'] = Date.parse(r['date']) || Date.parse(r['year']);

      Object.keys(r).forEach(k => {
        if(k !== 'siteId' && k !== 'date' && !labels[k]) {
          delete r[k];
        } else {
          const val = r[k];
          if(val === 'NA' || val === '' || val === undefined) {
            delete r[k];
          } else if(labels[k]) {
            r[k] = parseFloat(r[k]);
          }
        }
      });
    });

    // construct dframes
    const bySiteId = groupBy(rows, r => r.siteId);
    for(const [siteId, rows] of Object.entries(bySiteId)) {
      let dframe = new df.DataFrame(rows).setIndex('date')
      dframes[siteId] = dframes[siteId].concat(dframe).bake();
    }
  }


  importUSGSSites(sitesResponseData) {
    console.log('process usgs sites');

    const processedSiteIds = [];

    sitesResponseData.value.timeSeries.forEach(ts => {
      let site = {} as Site;

      const siteCode = ts.sourceInfo.siteCode[0].value;
      site.id = `usgs-${siteCode}`;
      site.dataset = 'usgs';

      if(!processedSiteIds.includes(site.id)) {
        processedSiteIds.push(site.id);

        const loc = ts.sourceInfo.geoLocation.geogLocation;
        site.lat = parseFloat(loc.latitude);
        site.lon = parseFloat(loc.longitude);
        site.name = ts.sourceInfo.siteName;
        site.observationFrequency = 'RT',
        site.observationDaysSinceLast = 0;

        this.registerSite(site);
      }
    });
  }


  // combinedCsv is several CSV text blocks combined
  // but each separated by a commented out (#) block 
  async processUSGSSeriesData(combinedCsv) {
    chunkUsgsResponse(combinedCsv).forEach(csv => { this.processUSGSSeriesDataSection(csv) });

    this.sortDataFrames();
  }

  processUSGSSeriesDataSection(dataCsv) {
    // log(data);
    let rows: any[] = Papa.parse(dataCsv, {
      delimiter: "\t",
      comments: "#"
    }).data;

    const agencyCol = 0;
    const siteCol = 1;
    const dateCol = 2;
    let tzCol;
    let flowCol;
    let heightCol;

    // Example:
    // ['agency_cd', 'site_no', 'datetime', 'tz_cd', '71793_00060', '71793_00060_cd', '71794_00065', '71794_00065_cd']
    // ['agency_cd', 'site_no', 'datetime', '294474_00060_00003', '294474_00060_00003_cd']
    for(let i in rows[0]) {
      let colname = rows[0][i];
      if(colname == 'tz_cd' ) {
        tzCol = i;
      } else if (/\d+_00060$/.test(colname)) {
        flowCol = i;
      } else if (/\d+_00060_00003$/.test(colname)) {
        flowCol = i;
      } else if (/\d+_00065$/.test(colname)) {
        heightCol = i;
      }
    }

    const dfRows = [];
    let siteId;

    rows.forEach(row => {
      // some rows have headers
      if(row[agencyCol] != 'USGS') {
        return;
      }

      siteId = 'usgs-' + row[siteCol];
      if(getSite(siteId)) {
        let tzOffset = 'EST'
        if(tzCol) {
          tzOffset = tzAbbr[row[tzCol]];
        }
        let dateStr = row[dateCol] + tzOffset;

        let columns: any = {};
        columns.date = Date.parse(dateStr);


        if(flowCol) {
          columns.flow = parseFloat(row[flowCol]) || 0.0;
        }

        if(heightCol) {
          columns.height = parseFloat(row[heightCol]) || 0.0;
        }

        if(flowCol || heightCol) {
          dfRows.push(columns);
        }
      }
    });

    // log(siteId, dfRows);

    let dframe = new df.DataFrame(dfRows).setIndex('date')
    dframes[siteId] = dframes[siteId].concat(dframe).bake();
  }




}

const model = new Model();
// window.model = model;

export { model };


//   printStatistics() {
//     // get ranges
//     let allSeries = {}
//     for (const [id, site] of Object.entries(this.sites)) {

//       for (const column of site.df.getColumns()) {
//         console.log(column);
//         const name = column.name;
//         const series = column.series;
//         console.log(name);
//         if(!allSeries[name]) {
//           allSeries[name] = new df.Series();
//         }

//         allSeries[name] = allSeries[name].concat(series)
//       }
//     }
//     console.log(allSeries);
//     for (const [name, series] of Object.entries(allSeries)) {
//       console.log(`${name} [${series.min()}, ${series.max()}]  AVG:${series.median()} MEDIAN:${series.median()}`);
//     }

//     // window.allSeries = allSeries;
//   }
// }