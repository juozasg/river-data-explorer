import type { Site } from "$lib/types/site";
import { sitesGeoindex } from "./data/geoindexes.svelte";

export class Sites {
	private sites: Site[] = $state([]);

	add(site: Site) {
		this.sites.push(site);
	}

	get all() {
		return this.sites;
	}

	inHuc10(huc10: string | undefined | number) {
		return this.sites.filter(s => s.huc10 === huc10);
	}

	findById(siteId: string) {
		return this.sites.find(s => s.id === siteId);
	}

	reindexGeometries() {
		for (const site of this.sites) {
			if(!site.huc10) {
				site.huc10 = sitesGeoindex[site.id]?.huc10 || '';
				// console.log('set index', site.id, site.huc10);
			}
		}
	}
}

export const sites = new Sites();

export function splitSiteId(siteId: string): { dataset: string, num: number } {
	const [dataset, ns] = siteId.split('-');
	return {dataset, num: parseInt(ns) };
}


