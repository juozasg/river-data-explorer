<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';
	import { addLayers } from '$src/lib/map/addDataSitesMap';

	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { fitFeatureBounds, makeSiteMarker, setFeatureState } from '$src/lib/utils/maplibre';
	import { addSources } from '$src/lib/map/addDataMap';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';

	// type Props = {
	// 	onSelected?: () => void;
	// } & Partial<MapLibreMapProps>;

	let { ...others }: Partial<MapLibreMapProps> = $props();

	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	let hoveredSite: Site | undefined = $state();
	let tooltip: HTMLDivElement | undefined = $state();

	onMount(() => {
		console.log('SiteSelectorMap onMount', divElement, mlMap, mapContainer);
	});

	$effect(() => {
		selectedArea.feature;
		console.log('FX TESTTEST siteselector', mlMap, mlMap?.loaded());
		if (!mlMap) return;
		const map = mlMap!;

		map.querySourceFeatures('huc10').forEach((feature) => {
			setFeatureState(map, 'huc10', feature.id, { selected: false });
		});

		if (selectedArea.feature) {
			setFeatureState(map, 'huc10', selectedArea.feature.id, { selected: true });
			fitFeatureBounds(map, selectedArea.feature);
		}
	});

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, mlMap!, site);
	};

	const onmouseenter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;

		// if(tooltip) {
		// 	// const rect = divElement?.getBoundingClientRect();
		// 	// console.log(rect, e.clientX, e.clientY);
		// 	// tooltip.style.left = (rect!.x + e.clientX) + 'px';
		// 	// tooltip.style.top = (rect!.y + e.clientY) + 'px';
		// 	// tooltip.style.display = 'block';
		// }
		// console.log('onmouseenter', site?.id, site);
	};
</script>

<MapLibreMap
	bind:this={mapContainer}
	{addSources}
	{addLayers}
	bind:divElement
	bind:mlMap
	{...others}
/>


{#each sites.selected as site (site.id)}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="marker"
		onmouseenter={(e) => onmouseenter(e, site)}
		onmouseleave={() => (hoveredSite = undefined)}
		use:makeMarker={site}
	>
		<div class="marker-box"></div>
	</div>
{/each}

{#if hoveredSite}
	<div
		bind:this={tooltip}
		class="hover-tooltip"
		style="position: absolute; z-index: 10; pointer-events: none;"
	>
		<h5>{hoveredSite.id}</h5>
		<p><b>{hoveredSite.name}</b></p>
	</div>
{/if}

<style>
	.marker {
		.marker-box {
			border: 1px solid #5c2f60;
			border-radius: 3px;
			transform: rotateY(0deg) rotate(45deg);

			width: 16px;
			height: 16px;
			background-color: rgba(90, 20, 110, 0.5);
		}
	}

	.hover-tooltip {
		background-color: white;
		border: 1px solid #222;
		padding: 5px;
		font-size: 80%;

		/* position: absolute; */
		/* top: -200px; */
		z-index: 1000;
	}
</style>
