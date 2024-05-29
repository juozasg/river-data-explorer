import { sites } from "../sites.svelte";
import boolInPoly from "@turf/boolean-point-in-polygon";


const emptyGeoJSON: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: []
};

// siteId: huc10
export type SiteGeometryIndex = { [key: string]: string; };
export type GeometryCollection = 'huc10' | 'huc12' | 'huc8' | 'counties' | 'basin-states';

export class Geometries {
	huc10: GeoJSON.FeatureCollection = $state(emptyGeoJSON);

	setHuc10(huc10: GeoJSON.FeatureCollection) {
		this.huc10 = huc10;
		sites.reindexGeometries();
	}

	getFeatureAtLatLon(collection: GeometryCollection, lat: number, lon: any): GeoJSON.Feature | undefined {
		const point = [lon, lat];
		return;

		for(const feature of this.huc10.features) {
			if(boolInPoly(point, feature.geometry)) {
				return feature;
			}
		}
	}
}


export const geometries = new Geometries();