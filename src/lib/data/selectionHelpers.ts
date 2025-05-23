import { riverappFeatureCollections } from "$src/appstate/data/riverappFeatureCollection.svelte";
import { BasinObject, basinObject1, basinObject2 } from "$src/appstate/selection/basinObjectSelection.svelte";
import type { Site } from "../types/site";


// TODO: remake this to work with target 1 and 2 most  of the time since Clear button is clicked should behave the same.
// auto mode:
// select a site into first free selectio slot (data1 or data2)
// if both slots are open select a side and a catchment into data1 and data2
// if both slots are filled replace data2
// if data1 is filled and data2 is empty, select a site into data2
// if a river is hovered, select a river catchment into first slot or data2
export function autoSelectBasinObjectsOnClick(hoveredSite: Site | undefined, hoveredRiverId: number | undefined) {

	// select both slots if both are empty and site is hovered
	if(!basinObject1.isSelected && !basinObject2.isSelected && hoveredSite?.id) {
		selectSiteAndCatchment(hoveredSite);
		return;
	}

	// select 1 slot
	let targetBasinObject: BasinObject | undefined;
	if(!basinObject1.isSelected) {
		targetBasinObject = basinObject1;
		console.log('selecting basinObject1');
	} else {
		targetBasinObject = basinObject2;
		console.log('selecting basinObject2');
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