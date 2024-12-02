<script lang="ts">
	import * as ml from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';

	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { transformStyle } from '$src/lib/data/map/helpers/transformMapStyle';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';
	import { onMount } from 'svelte';
	import { addMlmSources } from '$src/lib/data/map/mapData/mapSources';
	import { addMapLayers } from '$src/lib/data/map/mapData/regionsMapLayers';
	import { toggleRiverLayerVisibility } from '$src/lib/data/map/mapData/riverLayers';
		import { defaultLayersParams } from "$src/appstate/ui/layers.svelte";
	import { selectRegionTypeLayers } from '$src/lib/data/map/mapData/mapLayers';

	let {
		mlMap = $bindable(),
		// zoom = 11,
		zoom = 4,
		center = [-86.2536621504243, 41.699967298106515],
		layersParams = defaultLayersParams,
		addLayers = addMapLayers
	}: MapLibreMapProps = $props();

	let mapDiv = $state<HTMLDivElement>();
	export const mapDivElement = () => mapDiv;

	let clientWidth = $state(0);
	// // $effect(() => {console.log('CW', clientWidth)});

	// const arcgisServicesStyles =
	// 	// 'cached://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles';
	// 	'https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles';
	// const apiKey =
	// 	'AAPK3dfaa40a13c0404983142c26b566596ammsJLVROPRkVaZnrwj6bYIrYdi4FEikx7NZpYg7f5M9XlV2RFL6PgxMA_56IceHv';

	// const basemapEnum = 'e20332d6d2af43ff8402bb155df01467';
	// const basemapStyles = {
	// 	TOPO: `${arcgisServicesStyles}/items/${basemapEnum}?token=${apiKey}`,
	// 	SATELLITE: `${arcgisServicesStyles}/arcgis/imagery/?token=${apiKey}`
	// };

	$effect(() => {
		if (!mlMap) return;
		// toggleRiverLayerVisibility(mlMap, layersParams.riverLayerVisible);
	});



	// $effect(() => {
		// if (!mlMap) return;
		// console.log('layers regionType', layersParams.regionType);
		// const regionType = layersParams.regionType;
		// selectRegionTypeLayers(mlMap, layersParams.regionType);
	// });

	let _dataLoaded = $state(false);

	export const dataLoaded = () => {
		return _dataLoaded;
	};

	$effect(() => {
		if (!mlMap) return;

		// const style = basemapStyles[layersParams.baseStyleId];
		// mlMap.setStyle(style, { transformStyle });
	});

	onMount(() => {
		// const style = basemapStyles[layersParams.baseStyleId];
		mlMap = new ml.Map({
			container: mapDiv!, // container's id or the HTML element to render the map
			// style,
			style: 'https://demotiles.maplibre.org/style.json', // style URL
			center, // starting position [lng, lat]
			zoom, // starting zoom
			minZoom: 3,
			attributionControl: false
		});

		// mlMap.addControl(new ml.AttributionControl(), 'bottom-right');
		// mlMap.addControl(new ml.NavigationControl(), 'bottom-right');
		// console.log('map', mlMap)

		// only fires for the initial style, not for map.setStyle
		mlMap.once('idle', () => {
			mlMap!.resize();
			console.log('MAP IDLE');

			// addMlmSources(mlMap!).then(() => {
			// 	// addLayers(mlMap!);
			// 	// const style = basemapStyles[layersParams.baseStyleId];
			// 	// mlMap!.setStyle(style, { transformStyle }); // force transformStyle to reorder layers
			// 	// toggleRiverLayerVisibility(mlMap!, layersParams.riverLayerVisible);
			// 	// selectRegionTypeLayers(mlMap!, layersParams.regionType);

			// 	mlMap!.once('idle', () => (_dataLoaded = true));
			// });
		});

		// // global state for mouse x,y and lonlat location
		// used for C to copy lonlat
		// mlMap.on('mousemove', (e): void => {
		// 	mapMouseLocation.onMouseMove(mlMap, e);
		// });

		// toggleoffAttribution(mapDiv!);
	});

	// function onmouseleave() {
	// 	mapMouseLocation.onMouseOut();
	// 	tooltip.hide();
	// }
</script>

<!-- <div class="map" bind:this={mapDiv} {onmouseleave} role="figure" bind:clientWidth></div> -->
<div class="map" bind:this={mapDiv} role="figure" bind:clientWidth></div>

<style>
	.map {
		height: var(--map-height, 100%);
		/* width: var(--map-width, 100%); */
		z-index: 1;
		& :global(.maplibregl-ctrl-bottom-right  .maplibregl-ctrl-group) {
			margin-bottom: 3rem;
		}

		:global(.maplibregl-ctrl-group button+button) {
			border-radius: 0;
		}

		:global(.maplibregl-ctrl-group:not(:empty)) {
			box-shadow: var(--box-shadow);
			border-radius: var(--border-radius);
		}
	}
</style>
