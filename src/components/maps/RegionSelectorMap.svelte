<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { addLayers } from '$src/lib/data/map/areasMapData';
	import {
		MLMHoveredFeatureState,
		selectedRegion,
		selectedSite
	} from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { addSources } from '$src/lib/data/map/mapData';
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
	const hoveredArea = new MLMHoveredFeatureState();
	let hoveredSite: Site | null = $state(null);

	const hoveredAreaSites = $derived(
		sites.allEnabled.filter((s) => hoveredArea.id && s.huc10 === hoveredArea.id)
	);

	const hoveredAreaStats = $derived(
		hoveredAreaSites.length > 0 ? sitesDataStats(hoveredAreaSites) : undefined
	);


	// debug
	$effect(() => {
		if (
			window &&
			window.location.hostname === 'localhost' &&
			mlMap &&
			mlmComponent.dataLoaded() &&
			mlMap.getLayersOrder().includes('sjriver-huc10') &&
			!selectedSite.site
			&& false
		) {
			const huc10 = '0405000122';
			const siteId = 'sjrbc-45';
			const mlmFeature = mlMap.querySourceFeatures('sjriver-huc10', {
				sourceLayer: 'sjriver-huc10',
				// filter: ['==', 'huc10', "0405000121"]
				filter: ['==', 'huc10', huc10]
			})[0];

			mlmFeature.source = 'sjriver-huc10';
			selectedRegion.update(mlMap, mlmFeature);
			selectedSite.set(sites.all.find((s) => s.id === siteId));
			// console.log('DEBUG SELECTED', selectedSite.site, mlmFeature);
		}
	});

	const hoveredSiteStats = $derived(hoveredSite ? sitesDataStats([hoveredSite]) : undefined);

	onMount(() => {
		console.log('AreaSelectorMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e) => {
			hoveredArea.mouseMove(e, ['sjriver-huc10']);

			if (hoveredArea.feature) {
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
			} else {
				tooltip.hide();
			}
		});

		map.on('click', (e) => mapClick(e.point));
	});

	setTimeout(() => {
		try {
			if (
				window &&
				(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
			) {
				console.log('LOCALHOST DEBUGGING');
				// mapClick([500, 307.5546875]);
			}
		} catch (e) {
			console.error('timeout click error', e);
		}
	}, 2000);

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = null;
	};

	function mapClick(point: ml.PointLike) {
		const map = mlMap!;
		const feature = map.queryRenderedFeatures(point, { layers: ['sjriver-huc10'] })[0] || null;
		console.log('clicked feature', feature);
		const changed = selectedRegion.update(map, feature);
		if (changed || hoveredSite) {
			if (hoveredSite) selectedSite.set(hoveredSite);
			console.log('selectedSite', selectedSite.site);
			if (feature) onSelected?.();
		}
	}
</script>

{#snippet tooltipContent()}
	<div class="tooltip-content">
		<h5>{hoveredArea.name}</h5>
		{#if hoveredArea.feature}
			<i>HUC10: {hoveredArea.feature.id}</i>
			<p><b>{sites.inHuc10(hoveredArea.feature.id).length}</b> sites</p>
		{/if}
		{#if hoveredAreaStats}
			<TooltipSiteStats stats={hoveredAreaStats} />
		{/if}

		{#if hoveredSite}
			<h5 class="site tooltip-section">Site: {hoveredSite.name || ''}</h5>
			<i>Site ID: {hoveredSite.id}</i>
			{#if hoveredSiteStats}
				<TooltipSiteStats stats={hoveredSiteStats} />
			{/if}
		{/if}
	</div>
{/snippet}

<MapLibreMap
	bind:this={mlmComponent}
	{addSources}
	{addLayers}
	bind:divElement
	bind:mlMap
	{...others}
/>

{#if mlMap}
	{#each sites.allEnabled as site (site.id)}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} />
	{/each}
{/if}

<style>
</style>
