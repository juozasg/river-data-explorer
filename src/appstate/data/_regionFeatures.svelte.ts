// import { SvelteMap } from "svelte/reactivity";
// import type ColumnTable from "arquero/dist/types/table/column-table";
// import { defineGlobal } from "$src/lib/utils";

// const geometriesIds = new SvelteMap<string, string>();

// export function geomFeatureName(source: string | undefined, id: string | number | undefined): string {
// 	return '';
// }


// export const regionTypes = ['huc8', 'huc10', 'huc12', 'state', 'county', 'custom'] as const;

// export type RegionType = typeof regionTypes[number];

// export type RegionFeature = {
// 	regionType: RegionType;
// 	id: string | number;
// 	name: string;
// 	mlSource: string;

// 	geometry?: GeoJSON.Geometry;
// 	properties?: GeoJSON.GeoJsonProperties;

// 	annualTable?: ColumnTable;
// 	interpolatedTable?: ColumnTable;
// }

// export function regionEqual(a: RegionFeature, b: RegionFeature): boolean {
// 	return a.regionType === b.regionType && a.id == b.id;
// }

// // 'huc10-123456'
// export type RegionFeatureKey = string;
// export class RegionFeatures {
// 	#regionFeatures = new SvelteMap<RegionFeatureKey, RegionFeature>();
// 	#regionFeatureCollections = new SvelteMap<string, RegionFeature[]>();

// 	addGeoJSONCollection(regionType: RegionType | string, idField: string, data: GeoJSON.FeatureCollection) {

// 	}

// 	get(regionType: string, id: string | number): RegionFeature | undefined {
// 		return this.#regionFeatures.get(`${regionType}-${id}`);
// 	}

// 	getForSource(source: string, id: string | number): RegionFeature | undefined {
// 		const regionType = source.replace(/^riverapp-/, '');
// 		return this.get(regionType, id);
// 	}

// 	getRegionCollection(regionType: string): RegionFeature[] {
// 		return this.#regionFeatureCollections.get(regionType) || [];
// 	}

// 	getFeatureCollection(regionType: string): any {
// 		return [];
// 	}

// }

// export const regionFeatures = new RegionFeatures();

