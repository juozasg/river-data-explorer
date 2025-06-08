import { basinFeatureCollections } from "$src/appstate/data/basinFeatureCollection.svelte";
import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
import type { BasinObject } from "../../appstate/data/basinObject.svelte";
import type { Site } from "../types/site";


export type SelectionResult = {
	selectedTarget: '1' | '2';
	selectedType: 'site' | 'river-catchment' | 'site-catchment';
	selectedId: number;
}

export function autoSelectBasinObjectsOnClick(hoveredSite: Site | undefined, hoveredRiverId: number | undefined): SelectionResult | undefined {
	// select both slots if both are empty and site is hovered
	if (!basinObject1.isSelected && !basinObject2.isSelected && hoveredSite?.id) {
		selectSiteAndCatchment(hoveredSite);
		mapSelectionMode.mode = 'auto';
		mapSelectionMode.target = '2';
		return;
	}

	let selectedTarget: '1' | '2' | undefined;
	let selectedType: 'site' | 'river-catchment' | 'site-catchment' | undefined;
	let selectedId: number | undefined;

	// select 1 slot
	let targetBasinObject: BasinObject | undefined;
	if (mapSelectionMode.target === '1') {
		selectedTarget = '1';
		targetBasinObject = basinObject1;
		mapSelectionMode.mode = 'auto';
		mapSelectionMode.target = '2';
		// console.log('selecting basinObject1');
	} else {
		selectedTarget = '2';
		targetBasinObject = basinObject2;
		mapSelectionMode.mode = 'auto';
		mapSelectionMode.target = '1';
		// console.log('selecting basinObject2');
	}

	// select site or river catchment into the target basin object slot
	if (hoveredSite?.id) {
		targetBasinObject.set('site', hoveredSite?.id);
		selectedType = 'site';
		selectedId = hoveredSite?.id;
	} else if (hoveredRiverId) {
		const catchments = basinFeatureCollections.get('river-catchment');
		if (catchments) {
			const riverCatchment = catchments.features.find(f => f.properties?.id === hoveredRiverId);
			// console.log('riverCatchment', riverCatchment);
			if (riverCatchment?.properties?.id) {
				targetBasinObject.set('river-catchment', riverCatchment?.properties?.id);
				selectedType = 'river-catchment';
				selectedId = riverCatchment?.properties?.id;
			}
		}
	}

	if(selectedType && selectedId && selectedTarget) {
		return { selectedTarget, selectedType, selectedId };
	}
}

function selectSiteAndCatchment(hoveredSite: Site | undefined) {
	if (hoveredSite?.id) {
		basinObject1.set('site', hoveredSite?.id);
	}

	const catchments = basinFeatureCollections.get('site-catchment');
	if (catchments) {
		const siteCatchment = catchments.features.find(f => f.properties?.id === hoveredSite!.id);

		if (siteCatchment) {
			basinObject2.set('site-catchment', hoveredSite!.id);
		}
	}
}