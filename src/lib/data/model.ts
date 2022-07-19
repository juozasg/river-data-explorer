// // import Plotly from 'plotl'
// //import { readFile, Series, DataFrame } from 'data-forge';

// // date parsing
// // EST: new Date(Date.parse('2007-11-11 12:00-05:00'))
// // EDT: new Date(Date.parse('2007-11-11 12:00-04:00'))


// import {safeID, betweenDays} from '../../../legacy/lib/util/data-helpers.js'
// import {timer} from '../../../legacy/lib/util/debug.js'

// import Papa from 'papaparse';

// window.tzAbbr = tzAbbr;


// // TOD rewrite from this.sites to sitesStore being used
// export class Model {
//   // constructor() {
//   //   // { siteId => {name,lat,lon,feature,df}}
//   //   this.sites = {}
//   // }

//   constructor(sitesStore) {
//     // { siteId => {name,lat,lon,feature,df}}
//   }


//   // series of mean values of the sites
//   sitesMeanSeries(seriesId, siteIds) {
//     let allSeries = [];
//     siteIds.forEach(siteId => {
//       let series = this.sites[siteId].df.getSeries(seriesId);
//       if(series) {
//         allSeries.push(series);
//       }
//     });

//     let merged = df.Series.merge(allSeries);
//     let mean = merged.select(vals => _(vals).compact().mean()).bake();

//     return mean;
//   }




//   initElkhartSite(siteId, siteName, feature) {
//     feature.id = siteId;
//     let dframe = new df.DataFrame({columnNames: ['date'], rows: []}).setIndex('date');
//     this.sites[siteId] = {
//       dataset: 'elkhart',
//       siteId: siteId,
//       siteName: siteName,
//       lat: feature.geometry.coordinates[1],
//       lon: feature.geometry.coordinates[0],
//       feature: feature,
//       df: dframe,
//       datainfo: {
//         frequency: 'W',
//         lastObservation: 0
//       }
//     };
//   }


//   async processElkhart(data) {
//     data.features.forEach(feature => {
//       let props = feature.properties;
//       delete feature.properties;

//       // "Christiana Creek - CR 4" -> "elkhart-Christiana-Creek-CR-4"
//       const siteId = 'elkhart-' + safeID(props.Site_Location_Name);
//       if(!this.sites[siteId]) {
//         this.initElkhartSite(siteId, props.Site_Location_Name, feature);
//       }

//       let columns = {
//         raining: props["RAINING"],
//         wet: props["WET"] == "1",
//         temp: props["TEMP"],
//         do: props["DO"],
//         spc: props["SPC"],
//         ph: props["PH"],
//         nitrates: props["NITRATES"],
//         phosphorus: props["PHOSPHORUS"],
//         chlorides: props["CHLORIDES"],
//         tds: props["TDS"],
//         tss: props["TSS"],
//         ecoli: props["E__COLI"],
//         date: parseInt(props["DATE"]),
//         current: props["Current_"]
//       }

//       let dframe = new df.DataFrame([columns]).setIndex('date')
//       this.sites[siteId].df = this.sites[siteId].df.concat(dframe).bake();
//     });

//   }

//   sortByDate() {
//     let now = new Date(_.now());

//     for (const [id, site] of Object.entries(this.sites)) {
//       site.df = site.df.orderBy(row => row.date).bake();

//       if(site.dataset == 'elkhart') {
//         site.datainfo.lastObservation = betweenDays(new Date(site.df.getSeries('date').last()), now);
//       }
//     }
//   }

//   // turn all the sites into a geojson feature collection
//   siteFeatureCollection() {
//     const featureCollection = {
//       type: 'FeatureCollection',
//       features: _.values(_.mapValues(this.sites, 'feature'))
//     };


//     return featureCollection;
//   }

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


import * as df from 'data-forge';
import { sites, getSite } from "../stores";
import type { Site } from "../stores";

// import tzAbbr from 'timezone-abbr-offsets';


class Model {
//   getValue(siteId, seriesId) {
//     try {
//       if(seriesId == 'datainfo') {
//         return this.sites[siteId].datainfo;
//       }
//       let df = this.sites[siteId].df;
//       return df.getSeries(seriesId).bake().last();
//     } catch (error) {
//       return undefined;
//     }
//   }

  finalize() {
    // update the store with all the sites which will force render
  }


  getValue(siteId: string, seriesId: string) {
    if(seriesId === 'temp') {
      return 23.0;
    } else if(seriesId === 'datainfo') {
      return getSite(siteId)?.observationDaysSinceLast;
    } else {
      return undefined;
    }
  }



  importUSGSSites(sitesResponseData) {
    console.log('process usgs sites');

    const processedSiteIds = [];

    sitesResponseData.value.timeSeries.forEach(ts => {
      let site = {} as Site;
      
      const siteCode = ts.sourceInfo.siteCode[0].value;
      site.id = `usgs-${siteCode}`;

      if(!processedSiteIds.includes(site.id)) {
        processedSiteIds.push(site.id);

        const loc = ts.sourceInfo.geoLocation.geogLocation;
        site.lat = loc.latitude;
        site.lon = loc.longitude;
        site.name = ts.sourceInfo.siteName;
        site.observationFrequency = 'RT',
        site.observationDaysSinceLast = 0;

        // console.log(site);
        sites.update(sitesArr => [...sitesArr, site]);
      }
    });
  }


  
  // async processUSGSSeriesData(data) {
  //   return;
  //   let section = '';
  //   data.split("\n").forEach((l) => {
  //     if(l[0] == '#') {
  //       if(section.length > 0) {
  //         this.processUSGSSeriesDataSection(section);
  //         section = '';
  //       }
  //     } else {
  //       section = section + l + "\n";
  //     }
  //   });

  // }

//   processUSGSSeriesDataSection(data) {
//     // log(data);
//     let rows = Papa.parse(data, {
//       delimiter: "\t",
//       comments: "#"
//     }).data;

//     const agencyCol = 0;
//     const siteCol = 1;
//     const dateCol = 2;
//     let tzCol;
//     let flowCol;
//     let heightCol;

//     // Example:
//     // ['agency_cd', 'site_no', 'datetime', 'tz_cd', '71793_00060', '71793_00060_cd', '71794_00065', '71794_00065_cd']
//     // ['agency_cd', 'site_no', 'datetime', '294474_00060_00003', '294474_00060_00003_cd']
//     for(let i in rows[0]) {
//       let colname = rows[0][i];
//       if(colname == 'tz_cd' ) {
//         tzCol = i;
//       } else if (/\d+_00060$/.test(colname)) {
//         flowCol = i;
//       } else if (/\d+_00060_00003$/.test(colname)) {
//         flowCol = i;
//       } else if (/\d+_00065$/.test(colname)) {
//         heightCol = i;
//       }
//     }

//     const dfCols = [];
//     let siteId;

//     rows.forEach(row => {
//       // some rows have headers
//       if(row[agencyCol] != 'USGS') {
//         return;
//       }

//       siteId = 'usgs-' + row[siteCol];
//       if(this.sites[siteId]) {
//         let tzOffset = 'EST'
//         if(tzCol) {
//           tzOffset = tzAbbr[row[tzCol]];
//         }
//         let dateStr = row[dateCol] + tzOffset;

//         let columns = {
//           date: Date.parse(dateStr),

//         };

//         if(flowCol) {
//           columns.flow = parseFloat(row[flowCol]) || 0.0;
//         }

//         if(heightCol) {
//           columns.height = parseFloat(row[heightCol]) || 0.0;
//         }

//         if(flowCol || heightCol) {
//           dfCols.push(columns);
//         }
//       }
//     });

//     // log(siteId, dfCols);

//     let dframe = new df.DataFrame(dfCols).setIndex('date')
//     this.sites[siteId].df = this.sites[siteId].df.concat(dframe).bake();
//   }




}

const model = new Model();
// window.model = model;

export { model };
