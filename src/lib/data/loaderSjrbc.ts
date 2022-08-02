import { model } from  "./model";

import { fetchJSON, fetchText } from "./loader";

const remoteDir = 'https://nyc3.digitaloceanspaces.com/sjrbc/data';



export async function loadSJRBC() {
  try {
    let sites = await loadSJRBCites();
    // console.log(sites);

    const datasets = model.importSJRBCSites(sites);

    // console.log(datasets);
    

    // let seriesData = await loadSJRBCeriesData();
    // console.log(seriesData);

    // model.processSJRBCeriesData(seriesData);

  } catch(e) {
    console.error(e);
    throw e;
  }
}


async function loadSJRBCites() {
  const url = remoteDir + '/sites.csv';
  return fetchText(url);
}

// async function loadSJRBCeriesData() {
//   const startDate = '2000-01-01';
//   const monthAgoDate = strftime('%F', new Date(oneMonthAgo()));
//   const nowDate = strftime('%F', new Date(Date.now()));

//   const dailiesUrl = `https://waterservices.usgs.gov/nwis/dv/?format=rdb&sites=${SJRBCtationIds}&statCd=00003&siteStatus=all&startDT=${startDate}&endDT=${monthAgoDate}`;
//   const ivUrl = `https://waterservices.usgs.gov/nwis/iv/?format=rdb&sites=${SJRBCtationIds}&parameterCd=00060,00065&siteStatus=all&startDT=${monthAgoDate}&endDT=${nowDate}`;

//   const loadDailies = fetchText(dailiesUrl);
//   const loadIV = fetchText(ivUrl);

//   return Promise.all([loadDailies, loadIV]).then((results) => {
//     return results[0] + "\n" + results[1]
//   });

// }


