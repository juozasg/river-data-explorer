import * as sr from "svelte/reactivity";

export const geometriesIds = new sr.Map<string, string>();
export const geometries = new sr.Map<string, GeoJSON.FeatureCollection>();

export function geomFeatureName(source: string | undefined, id: string | number | undefined): string {
	if (!source) return !!id ? id.toString() : '';
	const col = source.replace(/^riverapp-/, '');
	const idProperty = geometriesIds.get(col) || 'id';
	const feature = geometries.get(col)?.features.find(f => f.properties?.[idProperty] === id);
	return feature?.properties?.name || id?.toString() || '';
}