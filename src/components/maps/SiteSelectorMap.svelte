<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import { addLayers } from '$src/lib/data/map/sitesMapData';
	import MapLibreMap from './MapLibreMap.svelte';

	import { hoveredSite, selectedArea, selectedSite } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { addSources } from '$src/lib/data/map/mapData';
	import type { Site } from '$src/lib/types/site';
	import { fitFeatureBounds, makeSiteMarker, setFeatureState } from '$src/lib/utils/maplibre';
	import Marker from './Marker.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import TooltipSiteStats from '../website/TooltipContentSiteStats.svelte';

	// type Props = {
	// 	onSelected?: () => void;
	// } & Partial<MapLibreMapProps>;

	let { ...others }: Partial<MapLibreMapProps> = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	const hoveredSiteStats = $derived(
		hoveredSite.site ? sitesDataStats([hoveredSite.site]) : undefined
	);

	onMount(() => {
		console.log('SiteSelectorMap onMount', divElement, mlMap, mlmComponent);
		mlMap!.on('click', (e) => mapClick(e.point));
	});

	// mark
	$effect(() => {
		selectedArea.feature;
		mlmComponent.dataLoaded();
		if (!mlMap || !mlmComponent.dataLoaded()) return;
		const map = mlMap!;

		map.querySourceFeatures('sjriver-huc10').forEach((feature) => {
			setFeatureState(map, 'sjriver-huc10', feature.id, { selected: false });
			// console.log('FALSE', feature.id);
		});

		if (selectedArea.feature) {
			setFeatureState(map, 'sjriver-huc10', selectedArea.feature.id, { selected: true });
			fitFeatureBounds(map, selectedArea.feature);
			// console.log('---TRUE0---', selectedArea.feature.id);
		}
	});

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		const rect = divElement?.getClientRects()[0];
		const [x, y] = [e.clientX - (rect!.left || 0), e.clientY - (rect!.top || 0)];

		// console.log(x, y)
		mlmComponent.showTooltip(x, y);
		hoveredSite.set(site);
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite.set(undefined);
		mlmComponent.hideTooltip();
	};

	function mapClick(point: ml.PointLike) {
		console.log(point);
		if (!mlMap) return;
		if (hoveredSite.site) {
			selectedSite.set(hoveredSite.site);
			console.log('SELECTED SITE', selectedSite);
		} else {
			selectedSite.set(undefined);
		}
	}

	function isHighlighted(site: Site) {
		return !!(selectedArea.id && selectedArea.id === site.huc10);
	}
</script>

{#snippet tooltipContent()}
	<h5>{hoveredSite.site?.name || ''}</h5>
	<p>{hoveredSite.site?.id || ''}</p>
	{#if hoveredSiteStats}
		<TooltipSiteStats stats={hoveredSiteStats} />
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
		<Marker
			map={mlMap}
			{markerMouseEnter}
			{markerMouseLeave}
			{site}
			highlighted={isHighlighted(site)}
		/>
	{/each}
{/if}

<style>
</style>
