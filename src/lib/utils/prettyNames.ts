import type { BasinObjectType } from "../../appstate/data/basinObject.svelte";

export function basinObjectTypeLabel(objectType: BasinObjectType | undefined): string {
	if (objectType === undefined) return '';
	if (objectType === 'site') return 'Site';
	if (objectType === 'huc8') return 'HUC8';
	if (objectType === 'huc10') return 'HUC10';
	if (objectType === 'huc12') return 'HUC12';
	if (objectType === 'state') return 'State';
	if (objectType === 'county') return 'County';
	if (objectType === 'river-catchment') return 'Catchment';
	if (objectType === 'site-catchment') return 'Site Catchment';
	return '';
}

export function basinObjectTypePluralLabel(objectType: BasinObjectType | undefined): string {
	if (objectType === undefined) return '';
	if (objectType === 'site') return 'Sites';
	if (objectType === 'huc8') return 'HUC8s';
	if (objectType === 'huc10') return 'HUC10s';
	if (objectType === 'huc12') return 'HUC12s';
	if (objectType === 'state') return 'States';
	if (objectType === 'county') return 'Counties';
	if (objectType === 'river-catchment') return 'Catchments';
	if (objectType === 'site-catchment') return 'Site Catchments';
	return '';
}