<!-- <script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import { addLayers } from '$src/lib/data/map/mapData/sitesMapData';
	import MapLibreMap from './MapLibreMap.svelte';

	import { hoveredSite, selectedRegion, selectedSite } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { addMlmSources } from '$src/lib/data/map/mapData/mapData';
	import type { Site } from '$src/lib/types/site';
	import { fitFeatureBounds, makeSiteMarker, setFeatureState } from '$src/lib/utils/maplibre';
	import Marker from './Marker.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import TooltipSiteStats from '../tooltips/TooltipContentSiteStats.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';

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

		mlMap!.on('mousemove', (e) => {
			if (hoveredSite.site) {
				tooltip.content = tooltipContent;
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
			} else {
				tooltip.hide();
			}
		});
	});

	// mark
	$effect(() => {
		selectedRegion.feature;
		mlmComponent.dataLoaded();
		if (!mlMap || !mlmComponent.dataLoaded()) return;
		const map = mlMap!;

		map.querySourceFeatures('riverapp-huc10').forEach((feature) => {
			setFeatureState(map, 'riverapp-huc10', feature.id, { selected: false });
		});

		if (selectedRegion.feature) {
			setFeatureState(map, 'riverapp-huc10', selectedRegion.feature.id, { selected: true });
			fitFeatureBounds(map, selectedRegion.feature);
		}
	});

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite.set(site);
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite.set(undefined);
		tooltip.hide();
	};

	function mapClick(point: ml.PointLike) {
		if (!mlMap) return;
		if (hoveredSite.site) {
			selectedSite.set(hoveredSite.site);
			console.log('SELECTED SITE', selectedSite.site);
		} else {
			selectedSite.set(undefined);
		}
	}

	function isHighlighted(site: Site) {
		return !!(selectedRegion.id && selectedRegion.id === site.huc10);
	}
</script>

{#snippet tooltipContent()}
	<h5>Site: {hoveredSite.site?.name || ''}</h5>
	<i>ID: {hoveredSite.site?.id || ''}</i>
	{#if hoveredSiteStats}
		<TooltipSiteStats stats={hoveredSiteStats} />
	{/if}
{/snippet}

	<MapLibreMap
		bind:this={mlmComponent}
		{addSources: addMlmSources}
		{addLayers}
		bind:divElement
		bind:mlMap
		containerClass="site-selector-map"
		{...others}
	/>

{#if mlMap}
	{#each sites.allEnabled as site (site.id)}
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
	:global(.site-selector-map .maplibregl-ctrl-attrib-inner) {
		display: none !important;
	}
	:global(.site-selector-map .maplibregl-ctrl-attrib) {
		display: none !important;
	}


</style> -->
