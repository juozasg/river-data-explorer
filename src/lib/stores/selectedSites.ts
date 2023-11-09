import { get, writable } from 'svelte/store';


// export const selectedSites = writable(new Set<string>(['usgs-04099750']));
export const selectedSites = writable(new Set<string>([]));

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

