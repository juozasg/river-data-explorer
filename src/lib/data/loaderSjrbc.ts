import { model } from  "./model";

import { fetchText } from "./loader";

const remoteDir = 'https://raw.githubusercontent.com/Limnogirl90/SJRBC-web-map-data/main';



export async function loadSJRBC() {
  try {
    let sites = await loadSites();

    const datasets = model.importSJRBCSites(sites);
    console.log(datasets);


    const loadDatasetsPromises = datasets.map(async name => {
      const dataCsv = await fetchText(remoteDir + '/' + name + '.csv');
      await model.processSJRBCSeriesData(dataCsv);
    });

    return Promise.all(loadDatasetsPromises).then(() => model.updateSitesDataInfo());
  } catch(e) {
    console.error(e);
    throw e;
  }
}


async function loadSites() {
  const url = remoteDir + '/sites.csv';
  return fetchText(url);
}
