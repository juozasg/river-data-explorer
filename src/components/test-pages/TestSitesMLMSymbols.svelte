<script lang="ts">
	import * as ml from "maplibre-gl";

	import { onMount } from "svelte";
	import MapLibreMap from "../mlmap/MapLibreMap.svelte";
	import { defineGlobal } from "$src/lib/utils";

	let mlMapComponent: MapLibreMap;
	onMount(() => {
		console.log("mlmap", mlMapComponent);

		// if (!mlMap) return;
		// mlMap.setCenter([-85.49182050000002, 41.82128218341444]);
		// mlMap.setZoom(8);
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
				id: v,
				// id: "site-" + v,
				properties: {
					'name': 'site-' + v
				},
				geometry: {
					type: "Point",
					coordinates: randCoord()
				}
			}))
		};
	}

	$effect(() => {
		if (!mlMapComponent.dataLoaded()) return;

		const map = mlMapComponent.mlmMap()!;

		map.loadImage("./shop-15.png", (error, image) => {
			if (error) throw error;
			map.addImage("store-icon", image as any, { sdf: true });
			// map.addSource("food-stores", {
			// 	type: "vector",
			// 	url: "mapbox://examples.dl46ljcs"
			// });
			const geojsonData = pointFeatureCollection(10);

			map.addSource("sitez", {
				generateId: true,
				type: "geojson",
				data: geojsonData,
			});

			geojsonData.features.forEach((feature) => {
				console.log("feature", feature);

				map.setFeatureState({ source: "sitez", id: feature.id }, { color: '#00CCCC', r: 20 });
			});

			map.addLayer({
				id: "sitez",
				source: "sitez",
				type: "circle",
				layout: {
					// "icon-image": "store-icon",
					// "icon-size": 1,
					// "icon-allow-overlap": true,
					// "allow-overlap":
					// "icon-ignore-placement": true
				},
				paint: {
					// "icon-color": ["feature-state", "color"]
					'circle-color': ["feature-state", "color"],
					// 'circle-color': '#CCCC00',
					'circle-radius': 15,
				}
			});


		});
	});

	function randomizeFS() {
		const map = mlMapComponent.mlmMap()!;

		const source = map.getSource("sitez") as ml.GeoJSONSource;
		const data = source._data as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

		console.log("_data", data);
		data.features.forEach((feature) => {
			// console.log("feature", feature);
			map.setFeatureState({ source: "sitez", id: feature.id }, { color: randomHexColor(), r: 20});
		});

		// console.log('map', map);
		defineGlobal('map', map);

	}
	// let flashingSquare = () => {
	// 	return {
	// 		width: 12,
	// 		height: 12,
	// 		data: new Uint8Array(12 * 12 * 4),
	// 		map: null as ml.Map | null,
	// 		previousValue: 0,

	// 		onAdd: function (map: ml.Map) {
	// 			this.map = map;
	// 		},

	// 		render: function () {
	// 			// keep repainting while the icon is on the map
	// 			this.map!.triggerRepaint();

	// 			// alternate between black and white based on the time
	// 			let value = Math.round(Date.now() / 1000) % 2 === 0 ? 255 : 0;

	// 			// check if image needs to be changed
	// 			if (value !== this.previousValue) {
	// 				this.previousValue = value;

	// 				let bytesPerPixel = 4;
	// 				for (let x = 0; x < this.width; x++) {
	// 					for (let y = 0; y < this.height; y++) {
	// 						let offset = (y * this.width + x) * bytesPerPixel;
	// 						this.data[offset + 0] = value;
	// 						this.data[offset + 1] = value;
	// 						this.data[offset + 2] = value;
	// 						this.data[offset + 3] = 255;
	// 					}
	// 				}

	// 				// return true to indicate that the image changed
	// 				return true;
	// 			}
	// 		}
	// 	};
	// };
</script>

<!-- <div>Panel map</div> -->

<button onclick={randomizeFS}>Randomize colors</button>

<input type="range" min="1" max="10000" onmousemove={randomizeFS} />
<MapLibreMap bind:this={mlMapComponent} />

<style>
</style>
