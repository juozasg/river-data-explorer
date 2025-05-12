import { riverappFeatureCollections } from "$src/appstate/data/riverappFeatureCollections";
import { BasinObject, basinObject1, basinObject2 } from "$src/appstate/selection/selectionsState.svelte";
import type { Site } from "../types/site";

// auto mode:
// select a site into first free selectio slot (data1 or data2)
// if both slots are open select a side and a catchment into data1 and data2
// if both slots are filled replace data2
// if data1 is filled and data2 is empty, select a site into data2
// if a river is hovered, select a river catchment into first slot or data2
export function autoSelectBasinObjectsOnClick(hoveredSite: Site | undefined, hoveredRiverId: number | undefined) {

	if(!basinObject1.isSelected() && !basinObject2.isSelected()) {
		selectSiteAndCatchment(hoveredSite);
		return;
	}

	let targetBasinObject: BasinObject | undefined;
	if (basinObject1.isSelected() && !basinObject2.isSelected()) {
		targetBasinObject = basinObject2;
	} else if (basinObject1.isSelected() && basinObject2.isSelected()) {
		targetBasinObject = basinObject2;
	} else if (!basinObject1.isSelected() && basinObject2.isSelected()) {
		targetBasinObject = basinObject1;
	} else {
		console.error('autoSelectBasinObjectsOnClick: no target basin object');
		return;
	}

	if (hoveredSite?.id) {
		targetBasinObject.set('site', hoveredSite?.id);
	} else if (hoveredRiverId) {
		const catchments = riverappFeatureCollections.get('river-catchments');
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

	const catchments = riverappFeatureCollections.get('site-catchments');
	if (catchments) {
		const siteCatchment = catchments.features.find(f => f.properties?.id === hoveredSite!.id);

		if (siteCatchment) {
			basinObject2.set('site-catchment', hoveredSite!.id);
		}
	}
}