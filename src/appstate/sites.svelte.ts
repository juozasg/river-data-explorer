import type { Site } from "$lib/types/site";

export class Sites {
	sites: Site[] = $state([]);
	selectedSites: Site[] = $state([]);

	add(site: Site) {
		this.sites.push(site);
	}

	get all() {
		return this.sites;
	}

	get selected() {
		return this.selectedSites;
	}

	findById(siteId: string) {
		return this.sites.find(s => s.id === siteId);
	}
}

export const sites = new Sites();


export function splitSiteId(siteId: string): { dataset: string, num: number } {
	const [dataset, ns] = siteId.split('-');
	return {dataset, num: parseInt(ns) };
}


