<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { MLMHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { addLayers } from '$src/lib/data/map/homePageMapData';
	import { addSources } from '$src/lib/data/map/mapData';
	import type { Site } from '$src/lib/types/site';
	import Marker from './Marker.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import TooltipSiteStats from '../website/TooltipContentSiteStats.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	const hoveredRiver = new MLMHoveredFeatureState(10);
	const hoveredArea = new MLMHoveredFeatureState();
	let hoveredSite: Site | null = $state(null);

	const hoveredSiteStats = $derived(hoveredSite ? sitesDataStats([hoveredSite]) : undefined);

	const hoveredAreaSites = $derived(
		sites.allEnabled.filter((s) => hoveredArea.id && s.huc10 === hoveredArea.id)
	);

	const hoveredAreaStats = $derived(
		hoveredAreaSites.length > 0 ? sitesDataStats(hoveredAreaSites) : undefined
	);

	onMount(() => {
		console.log('HomePageMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e: ml.MapMouseEvent ) => {
			hoveredRiver.mouseMove(e, ['sjriver-river']);
			hoveredArea.mouseMove(e, ['sjriver-huc10']);

			if (hoveredRiver.feature || hoveredSite || hoveredArea.feature) {
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
			} else {
				tooltip.hide();
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
		{#if hoveredArea.feature}
			<p><b>{sites.inHuc10(hoveredArea.feature.id).length}</b> sites</p>
		{/if}
		{#if hoveredAreaStats}
			<TooltipSiteStats stats={hoveredAreaStats} />
		{/if}
	{/if}
	{#if hoveredRiver.feature}
		<h5 class="river tooltip-section">River: {hoveredRiver.name}</h5>
		<!-- <i>ID: {hoveredRiver.id}</i> -->
	{/if}
	{#if hoveredSite}
		<h5 class="site tooltip-section">Site: {hoveredSite.name || ''}</h5>
		<i>Site ID: {hoveredSite.id}</i>
		{#if hoveredSiteStats}
			<TooltipSiteStats stats={hoveredSiteStats} />
		{/if}
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
	{#each sites.allEnabled as site}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} />
	{/each}
{/if}

<style>
</style>
