import * as ml from 'maplibre-gl';

export function randCoord() {
	return [-86.0 + Math.random(), 41.2 + Math.random()];
	// return [41.2 + Math.random(), -85.0 + Math.random()];
}

export function randCoords() {
	return Array.from({ length: 1000 }, () => randCoord());
}

export function randomHexColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}


export function randPointFeatureCollection(numPoints: number) {
	return {
		type: "FeatureCollection",
		features: Array.from({ length: numPoints }, (_, v) => ({
			type: "Feature",
			id: v + 1,
			// id: "site-" + v,
			properties: {
				name: "site-" + v
			},
			geometry: {
				type: "Point",
				coordinates: randCoord()
			}
		}))
	};
}


function randomizeFS(map: ml.Map) {

	const source = map.getSource("sitez") as ml.GeoJSONSource;
	const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

	console.log("_data", data);
	data.features.forEach((feature) => {
		// console.log("feature", feature);
		map.setFeatureState({ source: "sitez", id: feature.id }, { color: randomHexColor(), r: 20 });
	});

	// console.log('map', map);
}


function randomizeRegionsSource(map: ml.Map) {

	// pick random from huc8, huc10, huc12 and county geojson
	// const regionTypes = ["huc8", "huc10", "huc12", "county"];
	// const regionTypes = ["huc10", "huc12", "county"];
	// const regionType = regionTypes[Math.floor(Math.random() * regionTypes.length)];
	// const data = regionFeatures.getFeatureCollection(regionType);

	// console.log("regionType setting data", regionType, data);

	// // merge huc8, huc10, huc12 and county featureCollections
	// const allFeatures = regionTypes.map((rt) => regionFeatures.getFeatureCollection(rt).features).flat();
	// console.log("allFeatures", allFeatures);

	// const allFeatureCollection = {
	// 	type: "FeatureCollection",
	// 	features: allFeatures,
	// 	name: "allRegions"
	// };

	// // console.log("featureCollection", featureCollection);

	// console.log("data", data);

	// const source = map.getSource("riverapp-regions") as ml.GeoJSONSource;
	// // source.setData(featureCollection as any);
	// source.setData(data as any);

	// const layer = map.getLayer("riverapp-regions-fill");
	// layer?.setLayoutProperty("filter",  ["has", "huc12"]);
	// const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

	// console.log("_data", data);
	// data.features.forEach((feature) => {
	// console.log("feature", feature);
	// map.setFeatureState({ source: "regions", id: feature.id }, { color: randomHexColor(), r: 20 });
	// });

	// c
}