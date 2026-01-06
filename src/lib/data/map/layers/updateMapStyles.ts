import * as ml from "maplibre-gl";
import rgb2hex from "rgb2hex";

import { basinFeatureCollections } from "$src/appstate/data/basinFeatureCollection.svelte";
import { layerParams } from "$src/appstate/ui/layers.svelte";
import { interpolateVarColor } from "$src/lib/utils/colors";
import { varoutsidestandard } from "$src/lib/utils/varHelpers";
import { siteIdHasData, siteVarDateValue } from "../../siteTableHelpers";

export function updateSiteStyles(map: ml.Map, varname: string, vardate: Date) {
	const siteFeatures = basinFeatureCollections.get('site');

	siteFeatures?.features.forEach((siteFeature) => {
		const id: number = siteFeature.properties?.id;
		if (id) {
			if (!siteIdHasData(id, varname) && !layerParams.ghostSitesVisible) {
				// if the value is undefined, we want to set the site to ghost
				// this is used for sites that are not in the current basin
				map.setFeatureState(
					{ source: 'riverapp-sites', id: id },
					{
						color: '#ffffff',
						opacity: 0
					}
				);
				return;
			}


			const val = siteVarDateValue(id, varname, vardate);
			const color = rgb2hex(interpolateVarColor(varname, val));
			const stdbad = varoutsidestandard(varname, val);

			// const site = sites.get(id);
			// if(site?.siteId == 'sjrbc-2') {
			// 	console.log('updateSiteStyles sjrbc-2', site, vardate, val);
			// }

			if (color !== undefined) {
				// console.log('setting site color', id, colors);

				// set feature state to change the color of the site marker
				map.setFeatureState(
					{ source: 'riverapp-sites', id: id },
					{
						color: color.hex,
						opacity: color.alpha,
						'stroke-color': stdbad ? '#ff0000' : '#000000',
						'stroke-width': stdbad ? 2 : 1,
					}
				);
			}
		}
	});
}


export function setOverlayerLayer(map: ml.Map, selectedRaster: undefined | 'lulc' | 'elevation') {
	const elevationLayer = map.getLayer('riverapp-elevation-raster');
	const lulcLayer = map.getLayer('riverapp-lulc-raster');

	// console.log('setOverlayerLayer', selectedRaster, elevationLayer, lulcLayer);

	if(elevationLayer) map.setLayoutProperty(elevationLayer.id, "visibility", "none");
	if(lulcLayer) map.setLayoutProperty(lulcLayer.id, "visibility", "none");

	if(selectedRaster == 'elevation' ) {
			if(elevationLayer) map.setLayoutProperty(elevationLayer.id, "visibility", "visible");
	} else if (selectedRaster == 'lulc') {
		if(lulcLayer) map.setLayoutProperty(lulcLayer.id, "visibility", "visible");
	}

	// }
}