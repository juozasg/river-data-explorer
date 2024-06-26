<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { transformStyle } from '$src/lib/transformMapStyle';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';
	import { onMount } from 'svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	import MapTooltip from './MapTooltip.svelte';
	import { toggleRiverLayerVisibility } from '$src/lib/data/map/mapData';

	let {
		zoom = 8,
		center = [-85.5, 41.825],
		addSources,
		addLayers,
		divElement = $bindable(),
		mlMap = $bindable(),
		tooltipContent,
		...otherProps
	}: MapLibreMapProps = $props();

	console.log(JSON.stringify(otherProps));

	let baseStyleId: 'TOPO' | 'SATELLITE' = $state('TOPO');
	const arcgisServicesStyles =
		'https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/';
	const apiKey =
		'AAPK3dfaa40a13c0404983142c26b566596ammsJLVROPRkVaZnrwj6bYIrYdi4FEikx7NZpYg7f5M9XlV2RFL6PgxMA_56IceHv';

	const basemapEnum = 'e20332d6d2af43ff8402bb155df01467';
	const basemapStyles = {
		TOPO: `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/items/${basemapEnum}?token=${apiKey}`,
		SATELLITE: `${arcgisServicesStyles}/arcgis/imagery/?token=${apiKey}`
	};

	let showRiverLayer = $state(true);
	let tooltipComponent: MapTooltip | undefined = $state();

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
		mlMap.once('style.load', () => {
			addSources(mlMap!).then(() => {
				addLayers(mlMap!);
				const style = basemapStyles[baseStyleId];
				mlMap!.setStyle(style, { transformStyle }); // force transformStyle to reorder layers
				toggleRiverLayerVisibility(mlMap!, showRiverLayer);
			});
		});

		// global state for mouse x,y and lonlat location
		// used for C to copy lonlat
		mlMap.on('mousemove', (e): void => {
			mapMouseLocation.onMouseMove(mlMap, e);
		});

		mlMap.on('mouseout', (e): void => {
			const rect = divElement!.getClientRects()[0];
			const width = rect.width;
			const height = rect.height;
			console.log(rect)

			// mouseout event is fired when mouse hovers a marker inside the map rect
			if(e.point.x < 0 || e.point.x > width || e.point.y < 0 || e.point.y > height) {
				mapMouseLocation.onMouseOut();
				hideTooltip();
			}
		});

		toggleoffAttribution(divElement!);
	});

	$effect(() => {
		if (!mlMap) return;
		toggleRiverLayerVisibility(mlMap, showRiverLayer);
	});

	export const showTooltip = (x: number, y: number) => {
		tooltipComponent?.showTooltip(x, y);
	};

	export const hideTooltip = () => {
		tooltipComponent?.hideTooltip();
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div style="position: relative">
	<LayerSwitcher bind:baseStyleId bind:showRiverLayer />
	<div class="map" bind:this={divElement}></div>
	{#if mapMouseLocation.lngLat}
		<pre>{formatLngLat(mapMouseLocation.lngLat, 4)} press C to copy</pre>
	{/if}

	<MapTooltip bind:this={tooltipComponent} {tooltipContent}/>
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
