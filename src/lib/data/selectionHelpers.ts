import { basinFeatureCollections } from "$src/appstate/data/basinFeatureCollection.svelte";
import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
import type { BasinObject } from "../../appstate/data/basinObject.svelte";
import type { Site } from "../types/site";


export function autoSelectBasinObjectsOnClick(hoveredSite: Site | undefined, hoveredRiverId: number | undefined) {
	// select both slots if both are empty and site is hovered
	if(!basinObject1.isSet && !basinObject2.isSet && hoveredSite?.id) {
		selectSiteAndCatchment(hoveredSite);
		mapSelectionMode.mode = 'auto';
		mapSelectionMode.target = '2';
		return;
	}

	// select 1 slot
	let targetBasinObject: BasinObject | undefined;
	if(mapSelectionMode.target === '1') {
		targetBasinObject = basinObject1;
		mapSelectionMode.mode = 'auto';
		mapSelectionMode.target = '2';
		// console.log('selecting basinObject1');
	} else {
		targetBasinObject = basinObject2;
		mapSelectionMode.mode = 'auto';
		mapSelectionMode.target = '1';
		// console.log('selecting basinObject2');
	}

	// select site or river catchment into the target basin object slot
	if (hoveredSite?.id) {
		targetBasinObject.set('site', hoveredSite?.id);
	} else if (hoveredRiverId) {
		const catchments = basinFeatureCollections.get('river-catchment');
		if (catchments) {
			const riverCatchment = catchments.features.find(f => f.properties?.id === hoveredRiverId);
			// console.log('riverCatchment', riverCatchment);
			if(riverCatchment?.properties?.id) {
				targetBasinObject.set('river-catchment', riverCatchment?.properties?.id);
			}
		}
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