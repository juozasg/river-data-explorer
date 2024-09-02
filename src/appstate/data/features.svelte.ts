import type ColumnTable from "arquero/dist/types/table/column-table";
import * as sr from "svelte/reactivity";

const geometriesIds = new sr.Map<string, string>();
const geometries = new sr.Map<string, GeoJSON.FeatureCollection>();

export function geomFeatureName(source: string | undefined, id: string | number | undefined): string {
	if (!source) return !!id ? id.toString() : '';
	const col = source.replace(/^riverapp-/, '');
	const idProperty = geometriesIds.get(col) || 'id';
	const feature = geometries.get(col)?.features.find(f => f.properties?.[idProperty] === id);
	return feature?.properties?.name || id?.toString() || '';
}

export type RegionFeature = {
	regionType: string;
	id: string | number;
	name: string;
	mlSource: string;

	geometry?: GeoJSON.Geometry;
	properties?: GeoJSON.GeoJsonProperties;

	annualTable?: ColumnTable;
	interpolatedTable?: ColumnTable;
}

// 'huc10-123456'
export type RegionFeatureKey = string;
export class RegionFeatures {
	#regionFeatures = new sr.Map<RegionFeatureKey, RegionFeature>();
	#regionFeatureCollections = new sr.Map<string, RegionFeature[]>();

	addGeoJSONCollection(regionType: string, idField: string, data: GeoJSON.FeatureCollection) {
		const regionCollection = this.#regionFeatureCollections.get(regionType) || [];
		data.features.forEach((f: GeoJSON.Feature) => {
			const id = f.properties?.[idField] || f.id || '';
			const key = `${regionType}-${id}`;
			const mlSource = `riverapp-${regionType}`;

			const rf: RegionFeature = {
				regionType,
				id,
				name: f.properties?.name || id.toString(),
				mlSource,
				geometry: f.geometry,
				properties: f.properties,
			};

			this.#regionFeatures.set(key, rf);
			regionCollection.push(rf);
		});

		this.#regionFeatureCollections.set(regionType, regionCollection);
	}

	get(regionType: string, id: string | number): RegionFeature | undefined {
		return this.#regionFeatures.get(`${regionType}-${id}`);
	}

	getForSource(source: string, id: string | number): RegionFeature | undefined {
		const regionType = source.replace(/^riverapp-/, '');
		return this.get(regionType, id);
	}

	getRegionCollection(regionType: string): RegionFeature[] {
		return this.#regionFeatureCollections.get(regionType) || [];
	}
}

export const regionFeatures = new RegionFeatures();

if (typeof window !== 'undefined') {
	(window as any).geometries = geometries;
	(window as any).geometriesIds = geometriesIds;
	(window as any).regionFeatures = regionFeatures;
}