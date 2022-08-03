import { writable, get, Writable } from 'svelte/store';

export const showDataSelector = writable(true);
export const showTimeseries = writable(false);
export const showDataTable = writable(true);

// export const dataLoaded = writable(false);

export const selectedSeries = writable('datainfo');
export const selectedSites = writable(new Set<string>());

export const test = writable();


export const mapStore: Writable<L.Map> = writable();


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

export type ObservactionFrequency = 'Y' | 'M' | 'W' | 'D' | 'RT'

export type Site = {
  id: string,
  dataset: string,
  name: string,
  lat: number,
  lon: number,
  observationFrequency: string,
  observationDaysSinceLast: number,
}

type SiteMap = {
  [key: string]: Site
}

export const sites = writable({} as SiteMap);

export function getSite(siteId: string) {
  return get(sites)[siteId];
}

export function setSite(site: Site) {
  sites.update(siteMap => {
    siteMap[site.id] = site;
    return siteMap;
  });
}



export const viewportWidth = writable(window.innerWidth);
export const viewportHeight = writable(window.innerHeight);

window.addEventListener('resize', () => {
  viewportWidth.set(window.innerWidth);
  viewportHeight.set(window.innerHeight);
});