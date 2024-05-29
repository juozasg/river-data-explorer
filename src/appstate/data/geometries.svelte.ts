import * as sr from "svelte/reactivity";
import { sites } from "../sites.svelte";
// import boolInPoly from "@turf/boolean-point-in-polygon";


const emptyGeoJSON: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: []
};

// siteId: huc10
export type SiteGeometryIndex = { [key: string]: string; };
const collectionNames = ['huc10', 'huc12', 'huc8', 'counties', 'basin-states'] as const;
export type GeometryCollection = typeof collectionNames[number];

export class Geometries {
	// huc10: GeoJSON.FeatureCollection = $state(emptyGeoJSON);
	collections: Map<string, GeoJSON.FeatureCollection> = new sr.Map();

	constructor() {
		for(const name of collectionNames) {
			this.collections.set(name, emptyGeoJSON);
		}
	}

	get huc10(): GeoJSON.FeatureCollection {
		return this.collections.get('huc10')!;
	}


	set(name: GeometryCollection | string, data: GeoJSON.FeatureCollection) {
		if(!collectionNames.includes(name as any)) {
			return;
		}
		const numFeatures = this.collections.get(name)?.features.length;
		this.collections.set(name, data);

		if(numFeatures !== data.features.length) {
			sites.reindexGeometries();
		}
	}

}


export const geometries = new Geometries();