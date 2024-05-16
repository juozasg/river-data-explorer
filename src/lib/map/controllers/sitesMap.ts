import MapController from "./mapController";

export default class SitesMap extends MapController {
	createLayers() { }

	createEventListeners() {
		this.createMouseCoordinatesListeners();
	}
}