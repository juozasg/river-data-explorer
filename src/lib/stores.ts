import { writable, get } from 'svelte/store';

export const showDataSelector = writable(true);
export const showTimeseries = writable(false);
export const showDataTable = writable(false);

// export const dataLoaded = writable(false);

export const selectedSeries = writable('datainfo');
export const selectedSites = writable(new Set<string>());

export const test = writable()


function isSiteSelected(siteId: string) {
  return get(selectedSites).has(siteId);
}

export function toggleSiteSelection(siteId: string) {
  console.log('toggle selection', siteId);

  if(isSiteSelected(siteId)) {
    selectedSites.update(ids => {
      ids.delete(siteId);
      return ids
    });
  } else {
    selectedSites.update(ids => ids.add(siteId))
  }
}

export function clearSelectedSites() {
  selectedSites.set(new Set());
}


export type Site = {
  id: string,
  dataset: string,
  name: string,
  lat: number,
  lon: number,
  observationFrequency: string,
  observationDaysSinceLast: number,

}

// IDEA: store all the marker values (for every series type) in a store
// just use model.getValue for now
// export const sitesMapData = writable({'siteid': {'datainfo': 0, 'temp': 23} })

export const sites = writable([] as Site[]);

export function getSite(siteId) {
  return get(sites).find(site => site.id === siteId);
}



export const viewportWidth = writable(window.innerWidth);
export const viewportHeight = writable(window.innerHeight);

window.addEventListener('resize', () => {
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
});