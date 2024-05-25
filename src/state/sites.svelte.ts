import type { Site } from "$src/lib/types/model";

export class Sites {
	sites: Site[] = $state([]);
	selected: Site[] = $state([]);

	add(site: Site) {
		this.sites.push(site);
	}


}

export const sites = new Sites();