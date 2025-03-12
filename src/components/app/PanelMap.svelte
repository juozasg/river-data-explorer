<script lang="ts">
	import * as ml from "maplibre-gl";

	import { onMount } from "svelte";
	import MapLibreMap from "../mlmap/MapLibreMap.svelte";
	import { defineGlobal } from "$src/lib/utils";
	import { regionFeatures } from "$src/appstate/data/regionFeatures.svelte";
	import { loadGeometries } from "$src/lib/data/map/layers/mapSources";
	import { mapSelectionMode } from "$src/appstate/selection/objectInteractionState.svelte";

	let mlMapComponent: MapLibreMap;
	onMount(() => {
		console.log("mlmap", mlMapComponent);
		mapSelectionMode.mode = "river";
	});

	function randCoord() {
		return [-86.0 + Math.random(), 41.2 + Math.random()];
		// return [41.2 + Math.random(), -85.0 + Math.random()];
	}

	function randCoords() {
		return Array.from({ length: 1000 }, () => randCoord());
	}

	function randomHexColor() {
		return "#" + Math.floor(Math.random() * 16777215).toString(16);
	}

	function pointFeatureCollection(numPoints: number) {
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

	async function sauce() {
		await loadGeometries();
		const map = mlMapComponent.mlmMap()!;

		const geojsonData = pointFeatureCollection(10);
		console.log("geojsonData", geojsonData);

		map.addSource("riverapp-sitez", {
			type: "geojson",
			data: geojsonData
			// generateId: true,
		});

		map.addSource("riverapp-regions", {
			generateId: true,
			type: "geojson",
			data: {
				type: "FeatureCollection",
				features: []
			}
		});

		const insertBeforeLayer = "Water line/label/Default";

		map.addLayer(
			{
				id: "riverapp-regions",
				source: "riverapp-regions",
				type: "line",
				paint: {
					"line-color": "#088",
					"line-width": 2
					// "fill-opacity": 0.5
				}
			},
			insertBeforeLayer
		);

		map.addLayer(
			{
				id: "riverapp-regions-fill",
				source: "riverapp-regions",
				type: "fill",
				paint: {
					"fill-opacity": 0.2,
					"fill-color": "#088"
				}
			},
			insertBeforeLayer
		);
	}

	$effect(() => {
		if (!mlMapComponent.styleLoaded()) return;

		const map = mlMapComponent.mlmMap()!;
		// defineGlobal("map", map);

		// map.on("load", () => {
		// 	console.log("map load-2");
		// });

		map.once("idle", () => {
			console.log("map idle-2");
			randomizeRegionsSource();
		});

		// map.on(''

		// map.loadImage("./shop-15.png", (error, image) => {
		// if (error) throw error;
		// map.addImage("store-icon", image as any, { sdf: true });
		// map.addSource("food-stores", {
		// 	type: "vector",
		// 	url: "mapbox://examples.dl46ljcs"
		// });

		// map.setFilter("regions-fill", ["has", "huc12"]);

		// map.on('mousemove', 'regions-fill', (e) => {
		// 	console.log(' layer MMove', e.features?.map((f) => f.properties));
		// });

		// map.on('mouseleave', 'regions-fill', (e) => {
		// 	console.log(' layer mLEAVE', e.features?.map((f) => f.properties));
		// });

		// map.on('mouseover', 'regions-fill', (e) => {
		// 	console.log(' mouse OVER', e.features?.map((f) => f.properties));
		// });

		// 		geojsonData.features.forEach((feature) => {
		// 			console.log("inital feature", feature);

		// 			map.setFeatureState({ source: "sitez", id: feature.id }, { color: randomHexColor(), r: 20 });
		// 		});

		// 		geojsonData.features.forEach((feature) => {
		// 			console.log("READ inital feature", map.getFeatureState({ source: "sitez", id: feature.id }));

		// 		});
		// //
		// map.once('idle', () => {
		// console.log('map idle. adding layers');
		// randomizeFS();
		// map.addLayer({
		// 	id: "sitez",
		// 	source: "sitez",
		// 	type: "circle",
		// 	layout: {
		// 		// "icon-image": "store-icon",
		// 		// "icon-size": 1,
		// 		// "icon-allow-overlap": true,
		// 		// "allow-overlap":
		// 		// "icon-ignore-placement": true
		// 	},
		// 	paint: {
		// 		// "icon-color": ["feature-state", "color"]
		// 		"circle-color": ["feature-state", "color"],
		// 		// 'circle-color': '#CCCC00',
		// 		"circle-radius": 15
		// 	}
		// });
		// });

		// });
	});

	function randomizeFS() {
		const map = mlMapComponent.mlmMap()!;

		const source = map.getSource("sitez") as ml.GeoJSONSource;
		const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

		console.log("_data", data);
		data.features.forEach((feature) => {
			// console.log("feature", feature);
			map.setFeatureState({ source: "sitez", id: feature.id }, { color: randomHexColor(), r: 20 });
		});

		// console.log('map', map);
	}

	function randomizeRegionsSource() {
		const map = mlMapComponent.mlmMap()!;

		// pick random from huc8, huc10, huc12 and county geojson
		const regionTypes = ["huc8", "huc10", "huc12", "county"];
		const regionType = regionTypes[Math.floor(Math.random() * regionTypes.length)];
		const data = regionFeatures.getFeatureCollection(regionType);

		console.log("regionType setting data", regionType, data);

		// merge huc8, huc10, huc12 and county featureCollections
		const allFeatures = regionTypes.map((rt) => regionFeatures.getFeatureCollection(rt).features).flat();
		console.log("allFeatures", allFeatures);

		const featureCollection = {
			type: "FeatureCollection",
			features: allFeatures,
			name: "allRegions"
		};

		console.log("featureCollection", featureCollection);

		console.log("data", data);

		const source = map.getSource("riverapp-regions") as ml.GeoJSONSource;
		source.setData(featureCollection as any);

		// const layer = map.getLayer("riverapp-regions-fill");
		// layer?.setLayoutProperty("filter",  ["has", "huc12"]);
		// const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

		// console.log("_data", data);
		// data.features.forEach((feature) => {
		// console.log("feature", feature);
		// map.setFeatureState({ source: "regions", id: feature.id }, { color: randomHexColor(), r: 20 });
		// });

		// console.log('map', map);
	}
</script>

<!-- <div>Panel map</div> -->

<div class="debug-controls">
	<input type="range" min="1" max="10000" onmousemove={randomizeFS} />
	<button class="debug" onclick={randomizeFS}>Randomize colors</button>
	<button class="debug" onclick={randomizeRegionsSource}>Randomize Regions</button>
	<button class="debug" onclick={() => mlMapComponent.setBasemapStyle("TOPO")}>TOPO</button>
	<button class="debug" onclick={() => mlMapComponent.setBasemapStyle("SATELLITE")}>SAT</button>
</div>

<MapLibreMap bind:this={mlMapComponent} addData={sauce} />

<style>
	.debug-controls {
		position: absolute;
		/* top: 50px; */
		left: 10;
		background-color: rgba(128, 128, 128, 0.289);
		padding: 0.5rem;
		z-index: 1000;
		width: 100vw;
		display: flex;

		gap: 20px;
	}
</style>
