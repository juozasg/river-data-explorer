<script lang="ts">
	import * as ml from "maplibre-gl";

	import { onMount } from "svelte";
	import MapLibreMap from "../mlmap/MapLibreMap.svelte";

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

	function pointFeatureCollection(numPoints: number) {
		return {
			type: "FeatureCollection",
			features: Array.from({ length: numPoints }, () => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: randCoord()
				}
			}))
		};
	}

	// console.log('randCoord', randCoords());

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

	$effect(() => {
		if (!mlMapComponent.dataLoaded()) return;

		const map = mlMapComponent.mlmMap()!;

		map.loadImage(
			"./shop-15.png",
			(error, image) => {
				if (error) throw error;
				map.addImage("store-icon", image as any, { sdf: true });
				// map.addSource("food-stores", {
				// 	type: "vector",
				// 	url: "mapbox://examples.dl46ljcs"
				// });
				map.addSource('sites', {
					type: "geojson",
					data: pointFeatureCollection(1000)
				});

				map.addLayer({
					id: "sites",
					source: "sites",
					type: "symbol",
					layout: {
						"icon-image": "store-icon",
						"icon-size": 1,
						"icon-allow-overlap": true,
						"icon-ignore-placement": true
					},
					paint: {
						"icon-color": "#FF0000"
					}
				});
			}
		);

		// for (let i = 0; i <= 1; i++) {
		// 	map.addImage(`flashing_square-${i}`, flashingSquare());

		// 	map.addSource(`drone-${i}`, {
		// 		type: "geojson",
		// 		data: {
		// 			type: "Feature",
		// 			geometry: {
		// 				type: "Point",
		// 				coordinates: randCoord()
		// 			}
		// 		}
		// 	});

		// 	map.addLayer({
		// 		id: `drone-${i}`,
		// 		type: "symbol",
		// 		source: `drone-${i}`,
		// 		layout: {
		// 			"icon-image": `flashing_square-${i}`
		// 		}
		// 	});
		// }

		// console.log('mllibre map', map);
	});
</script>

<!-- <div>Panel map</div> -->
<MapLibreMap bind:this={mlMapComponent} />

<style>
</style>
