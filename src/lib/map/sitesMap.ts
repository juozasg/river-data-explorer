import MapController from "./markersController";
import * as ml from 'maplibre-gl';


export default class SitesMap extends MapController {
	selectedAreaFeatureId: number | string | null = null;



	onAreaSelected(feature: ml.MapGeoJSONFeature | null) {
		if(this.map._fullyLoaded) {
			if(this.selectedAreaFeatureId) {
				// console.log('clear', this.selectedAreaFeatureId)
				this.map.setFeatureState(
					{ source: 'sites-huc10', id: this.selectedAreaFeatureId },
					{ selected: false }
				);
			}

			if(feature) {
				// console.log('set', feature.id)

				this.map.setFeatureState(
					{ source: 'sites-huc10', id: feature.id },
					{ selected: true }
				);

				const geometry = feature.geometry as any;
				console.log(feature)
				console.log(geometry)
				const coordinates: ml.LngLatLike[] = geometry.coordinates[0];

				// Pass the first coordinates in the LineString to `lngLatBounds` &
				// wrap each coordinate pair in `extend` to include them in the bounds
				// result. A variation of this technique could be applied to zooming
				// to the bounds of multiple Points or Polygon geomteries - it just
				// requires wrapping all the coordinates with the extend method.
				const bounds = coordinates.reduce((bounds, coord) => {
					return bounds.extend(coord);
				}, new ml.LngLatBounds(coordinates[0], coordinates[0]));

				this.map.fitBounds(bounds, {
					padding: 20
				});
			}
		}

		this.selectedAreaFeatureId = feature?.id || null;
	}
}