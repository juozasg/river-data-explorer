import { writable, get } from 'svelte/store';

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

