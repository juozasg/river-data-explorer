import { BasinObject, BasinObjectVariable } from "$src/appstate/data/basinObject.svelte";


export const basinObject1 = new BasinObject();
export const basinObject2 = new BasinObject();


export const chartYSelection = new BasinObjectVariable();
export const chartZSelection = new BasinObjectVariable();


export type MapSelectionMode = 'auto' | 'site' | 'huc10' | 'huc12' | 'county' | 'river-catchment' | 'site-catchment'; // | 'custom-click' | 'custom-draw';

// when mode is 'auto', target is picked based on emptiness of data1 or data2 and the hovered region
export const mapSelectionMode = $state({
	mode: 'auto' as MapSelectionMode,
	target: '1' as '1' | '2',
});

export const mapSelectionTargetObject = () =>  mapSelectionMode.target === '1' ? basinObject1 : basinObject2;

