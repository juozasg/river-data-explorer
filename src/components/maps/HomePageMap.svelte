<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { HoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { addLayers } from '$src/lib/data/map/homePageMapData';
	import { addSources } from '$src/lib/data/map/mapData';
	import type { Site } from '$src/lib/types/site';
	import Marker from './Marker.svelte';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	const hoveredRiver = new HoveredFeatureState(10);
	const hoveredArea = new HoveredFeatureState();
	let hoveredSite: Site | null = $state(null);

	onMount(() => {
		console.log('HomePageMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e) => {
			hoveredRiver.mouseMove(e, ['sjriver-river']);
			hoveredArea.mouseMove(e, ['sjriver-huc10']);

			if(hoveredRiver.feature || hoveredSite || hoveredArea.feature) {
				mlmComponent.showTooltip(e.point.x, e.point.y);
			} else {
				mlmComponent.hideTooltip();
			}
		});
	});

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		// console.log('markermouse', site?.id, site);
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		// console.log('markermouse', site?.id, site);
		hoveredSite = null;
	};
</script>

{#snippet tooltipContent()}
	{#if hoveredArea.feature}
		<h5>Watershed: {hoveredArea.name}</h5>
		<i>HUC10: {hoveredArea.id}</i>
	{/if}
	{#if hoveredRiver.feature}
		<h5 class="river tooltip-section">River: {hoveredRiver.name}</h5>
		<!-- <i>ID: {hoveredRiver.id}</i> -->
	{/if}
	{#if hoveredSite}
		<h5 class="site tooltip-section">Site: {hoveredSite.name || ''}</h5>
		<i>Site ID: {hoveredSite.id}</i>
	{/if}
{/snippet}

<MapLibreMap
	bind:this={mlmComponent}
	{addSources}
	{addLayers}
	{tooltipContent}
	bind:divElement
	bind:mlMap
	{...others}
/>

{#if mlMap}
	{#each sites.all as site}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} />
	{/each}
{/if}

<style>
</style>
