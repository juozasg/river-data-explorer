<script lang="ts">
	import * as ml from 'maplibre-gl';
	import * as maptilersdk from '@maptiler/sdk';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { listenMouseMoveCoordinates } from '$src/lib/map/mouseMoveCoordinates';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { flushSync, onMount } from 'svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	import { toggleRiverLayerVisibility } from '$src/lib/map/addDataMap';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';
	import MapTooltip from './MapTooltip.svelte';

	let {
		zoom = 8,
		center = [-85.5, 41.825],
		addSources,
		addLayers,
		divElement = $bindable(),
		mlMap = $bindable(),
		tooltipContent
	}: MapLibreMapProps = $props();

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');
	const arcgisServicesStyles = 'https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/'
	const apiKey = "AAPK3dfaa40a13c0404983142c26b566596ammsJLVROPRkVaZnrwj6bYIrYdi4FEikx7NZpYg7f5M9XlV2RFL6PgxMA_56IceHv";

	const basemapStyles = {
		TOPO: `${arcgisServicesStyles}/arcgis/outdoor/?token=${apiKey}`,
		SATELLITE: `${arcgisServicesStyles}/arcgis/imagery/?token=${apiKey}`
	};
	let showRiverLayer = $state(true);

	let tooltipComponent: MapTooltip | undefined = $state();

	let mlmFsm: 'init' | 'loading-style' | 'style-loaded' | 'loading-data' | 'loaded' =
	$state('init');

	const transformStyle = (previousStyle: ml.StyleSpecification | any, nextStyle: ml.StyleSpecification) => {
		console.log(previousStyle, nextStyle, 'STYLE TRANSFORM');


		const keepSources: any = {};
		if(previousStyle.sources.huc8) {
			keepSources['huc8'] = previousStyle.sources.huc8;
		}
		const keepLayers = previousStyle.layers?.filter((l: any) => l.id.match(/^sjrb-/)) || [];

		return {
			...nextStyle,
			sources: {
				...nextStyle.sources,
				...keepSources,
			},
			layers: [
				...nextStyle.layers,
				keepLayers,
			// ]
		};
	}
	$effect(() => {
		if (!mlMap) return;

		// const style = maptilersdk.MapStyle[baseStyleId];
		// (mlMap as maptilersdk.Map).setStyle(style);

		const style = basemapStyles[baseStyleId];
		mlMap.setStyle(style, {transformStyle});
		// mlmFsm = 'loading-style';
	});



	// $effect(() => {
	// 	if (mlmFsm === 'style-loaded') {
	// 		mlmFsm = 'loading-data';

	// 	}
	// });

	// $effect(() => {
	// 	if (mlmFsm === 'loaded') {
	// 		toggleRiverLayerVisibility(mlMap!, showRiverLayer);
	// 	}
	// });

	onMount(() => {
		// const maptilerKey = '4zPvHZlweLbGaEy9LI4Z';
		// maptilersdk.config.apiKey = maptilerKey;

		// const basemapEnum = "arcgis/outdoor";
		// const basemapEnum = "arcgis/imagery";

		const style = basemapStyles[baseStyleId];
		mlMap = new ml.Map({
			container: divElement!, // container's id or the HTML element to render the map
			// style: maptilersdk.MapStyle[baseStyleId], // style URL
			// style: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/${basemapEnum}?token=${apiKey}`,
			style,
			center, // starting position [lng, lat]
			zoom, // starting zoom
			minZoom: 3
		});

		// only fires for the initial style, not for map.setStyle!
		mlMap.on('style.load', () => {
			mlmFsm = 'style-loaded';
		});

		mlMap.on('idle', () => {
			if (mlmFsm === 'loading-style') {
				mlmFsm = 'style-loaded';
			}

			if (mlmFsm === 'loading-data') {
				mlmFsm = 'loaded';
			}
		});

		listenMouseMoveCoordinates(mlMap);
		toggleoffAttribution(divElement!);
	});

	export const showTooltip = (x: number, y: number) => {
		tooltipComponent?.showTooltip(x, y);
	}

	export const hideTooltip = () => {
		tooltipComponent?.hideTooltip();
	}

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
	<LayerSwitcher bind:baseStyleId bind:showRiverLayer />
	<div class="map" bind:this={divElement}></div>
	{#if mapMouseLocation.lngLat}
	<pre>{formatLngLat(mapMouseLocation.lngLat, 4)} press C to copy</pre>
	{/if}

	<MapTooltip bind:this={tooltipComponent} {tooltipContent} />
</div>

<style>
	.map {
		/* position: absolute; */
		/* top: 0; */
		/* bottom: 0; */
		height: var(--map-height, 500px);
		width: var(--map-width, 100%);
		z-index: 1;
	}

	pre {
		position: absolute;
		bottom: -22px;
		left: 110px;
		z-index: 2;
		background: none;
		padding: 0.5rem;
		pointer-events: none;
	}
</style>
