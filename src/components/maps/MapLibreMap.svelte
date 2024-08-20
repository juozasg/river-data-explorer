<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { transformStyle } from '$src/lib/data/map/transformMapStyle';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';
	import { onMount } from 'svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	import { toggleRiverLayerVisibility } from '$src/lib/data/map/mapData';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';

	let {
		zoom = 8,
		center = [-85.5, 41.825],
		addSources,
		addLayers,
		divElement = $bindable(),
		mlMap = $bindable(),
		containerClass = '',
	}: MapLibreMapProps = $props();

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');
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

	let showRiverLayer = $state(true);
	// let tooltipComponent: MapTooltip | undefined = $state();

	let _dataLoaded = $state(false);

	export const dataLoaded = () => {
		return _dataLoaded;
	};

	$effect(() => {
		if (!mlMap) return;

		const style = basemapStyles[baseStyleId];
		mlMap.setStyle(style, { transformStyle });
	});

	onMount(() => {
		const style = basemapStyles[baseStyleId];
		mlMap = new ml.Map({
			container: divElement!, // container's id or the HTML element to render the map
			style,
			center, // starting position [lng, lat]
			zoom, // starting zoom
			minZoom: 3
		});

		// only fires for the initial style, not for map.setStyle
		mlMap.once('idle', () => {
			addSources(mlMap!).then(() => {
				addLayers(mlMap!);
				const style = basemapStyles[baseStyleId];
				mlMap!.setStyle(style, { transformStyle }); // force transformStyle to reorder layers
				toggleRiverLayerVisibility(mlMap!, showRiverLayer);
				mlMap!.once('idle', () => (_dataLoaded = true));
				// _dataLoaded = true;
			});
		});

		// global state for mouse x,y and lonlat location
		// used for C to copy lonlat
		mlMap.on('mousemove', (e): void => {
			mapMouseLocation.onMouseMove(mlMap, e);
		});

		toggleoffAttribution(divElement!);
	});

	function containerMouseLeave() {
		mapMouseLocation.onMouseOut();
		tooltip.hide();
	}

	$effect(() => {
		if (!mlMap) return;
		toggleRiverLayerVisibility(mlMap, showRiverLayer);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height: 100%" class={containerClass}>
	<LayerSwitcher bind:baseStyleId bind:showRiverLayer />
	<div class="map" bind:this={divElement} onmouseleave={containerMouseLeave}></div>
	{#if mapMouseLocation.lngLat}
		<pre>{formatLngLat(mapMouseLocation.lngLat, 4)} press C to copy</pre>
	{/if}
</div>

<style>
	.map {
		/* position: absolute; */
		/* top: 0; */
		/* bottom: 0; */
		height: var(--map-height, 100%);
		width: var(--map-width, 100%);
		z-index: 1;
	}

	pre {
		position: absolute;
		bottom: -10px;
		left: 0px;
		z-index: 2;
		background: none;
		padding: 0.5rem;
		pointer-events: none;
	}
</style>
