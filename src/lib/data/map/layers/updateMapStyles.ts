import * as ml from "maplibre-gl";
import rgb2hex from "rgb2hex";

import { basinFeatureCollections } from "$src/appstate/data/basinFeatureCollection.svelte";
import { interpolateVarColor } from "$src/lib/utils/colors";
import { varoutsidestandard } from "$src/lib/utils/varHelpers";
import { siteVarDateValue } from "../../siteTableHelpers";

export function	updateSiteStyles(map: ml.Map, varname: string, vardate?: Date) {
		const siteFeatures = basinFeatureCollections.get('site');

		siteFeatures?.features.forEach((siteFeature) => {
			const id: number = siteFeature.properties?.id;
			if (id) {
				const val = siteVarDateValue(id, varname, vardate);
				const color = rgb2hex(interpolateVarColor(varname, val));
				const stdbad = varoutsidestandard(varname, val);


				if (color !== undefined) {
					// console.log('setting site color', id, colors);

					// set feature state to change the color of the site marker
					map.setFeatureState(
						{ source: 'riverapp-sites', id: id },
						{
							color: color.hex,
							opacity: color.alpha
						}
					);
				}
			}
		});
	}