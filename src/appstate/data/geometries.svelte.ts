import { sites } from "../sites.svelte";

const emptyGeoJSON: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: []
};

// function huc10ForLatLon(lat: number, lon: number) {
// 	console.log('querying geometries in huc10', geometries.huc10.features.length);

// 	return '1122333';
// }

// $effect(() => {
// 	for (const site of sites.all) {
// 		site.huc10 = site.huc10 || huc10ForLatLon(site.lat, site.lon);
// 	}

// 	console.log('INDEX $effect indexed sites count', sites.all.length, 'huc10 count', Object.keys(geometries.sitesHuc10).length);
// });

// siteId: huc10
export type SiteGeometryIndex = { [key: string]: string; };
export type GeometryCollection = 'huc10' | 'huc12' | 'huc8' | 'counties' | 'basin-states';

export class Geometries {
	huc10: GeoJSON.FeatureCollection = $state(emptyGeoJSON);
	// sitesHuc10: SiteGeometryIndex = $derived.by(() => {

	// 	const sitesHucs: SiteGeometryIndex = {};
	// 	for (const site of sites.all) {
	// 		sitesHucs[site.id] = site.huc10 || huc10ForLatLon(site.lat, site.lon);
	// 		site.huc10 = sitesHucs[site.id];
	// 	}
	// 	console.log('INDEX $derived huc10 index', sitesHucs);
	// 	return sitesHucs;

	// 	// 	acc[site.id] = site.huc10;
	// 	// 	return acc;
	// 	// });

	// 	// return sitesHucs;

	// });

	setHuc10(huc10: GeoJSON.FeatureCollection) {
		this.huc10 = huc10;
		sites.reindexGeometries();
	}

	getFeatureAtLatLon(collection: GeometryCollection, lat: number, lon: any): GeoJSON.Feature | undefined {
		return this.huc10.features[0];
	}
}


export const geometries = new Geometries();