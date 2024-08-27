<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { transformStyle } from '$src/lib/data/map/helpers/transformMapStyle';
	import { addMlmSources, toggleRiverLayerVisibility } from '$src/lib/data/map/mapData/mapData';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';
	import { onMount } from 'svelte';
	import { addMlmLayers } from '$src/lib/data/map/mapData/regionsMapData';

	let {
		mlMap = $bindable(),
		zoom = 7.9,
		center = [-85.5, 41.825],
		layersParams
	}: MapLibreMapProps = $props();

	let mapDiv = $state<HTMLDivElement>();
	export const mapDivElement = $derived(mapDiv);

	const arcgisServicesStyles =
		// 'cached://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles';
		'https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles';
	const apiKey =
		'AAPK3dfaa40a13c0404983142c26b566596ammsJLVROPRkVaZnrwj6bYIrYdi4FEikx7NZpYg7f5M9XlV2RFL6PgxMA_56IceHv';

	const basemapEnum = 'e20332d6d2af43ff8402bb155df01467';
	const basemapStyles = {
		TOPO: `${arcgisServicesStyles}/items/${basemapEnum}?token=${apiKey}`,
		SATELLITE: `${arcgisServicesStyles}/arcgis/imagery/?token=${apiKey}`
	};

	$effect(() => {
		if (!mlMap) return;
		toggleRiverLayerVisibility(mlMap, layersParams.riverLayerVisible);
	});

	let _dataLoaded = $state(false);

	export const dataLoaded = () => {
		return _dataLoaded;
	};

	$effect(() => {
		if (!mlMap) return;

		const style = basemapStyles[layersParams.baseStyleId];
		mlMap.setStyle(style, { transformStyle });
	});

	onMount(() => {
		const style = basemapStyles[layersParams.baseStyleId];
		mlMap = new ml.Map({
			container: mapDiv!, // container's id or the HTML element to render the map
			style,
			center, // starting position [lng, lat]
			zoom, // starting zoom
			minZoom: 3,
			attributionControl: false
		});

		mlMap.addControl(new ml.AttributionControl(), 'bottom-right');

		// only fires for the initial style, not for map.setStyle
		mlMap.once('idle', () => {
			addMlmSources(mlMap!).then(() => {
				addMlmLayers(mlMap!);
				const style = basemapStyles[layersParams.baseStyleId];
				mlMap!.setStyle(style, { transformStyle }); // force transformStyle to reorder layers
				toggleRiverLayerVisibility(mlMap!, layersParams.riverLayerVisible);
				mlMap!.once('idle', () => (_dataLoaded = true));
			});
		});

		// global state for mouse x,y and lonlat location
		// used for C to copy lonlat
		mlMap.on('mousemove', (e): void => {
			mapMouseLocation.onMouseMove(mlMap, e);
		});

		toggleoffAttribution(mapDiv!);
	});

	function onmouseleave() {
		mapMouseLocation.onMouseOut();
		tooltip.hide();
	}
</script>

<div class="map" bind:this={mapDiv} {onmouseleave}></div>

<style>
	.map {
		height: var(--map-height, 100%);
		width: var(--map-width, 100%);
		z-index: 1;
	}
</style>
