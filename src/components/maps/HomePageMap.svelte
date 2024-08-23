<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { MLMHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { addLayers } from '$src/lib/data/map/mapData/homePageMapData';
	import { addSources } from '$src/lib/data/map/mapData/mapData';
	import type { Site } from '$src/lib/types/site';
	import Marker from './Marker.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import TooltipSiteStats from '../website/TooltipContentSiteStats.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { ghost, siteVariableColor } from '$src/lib/data/map/helpers/markerHelpers';
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import { siteGetBeforeDate } from '$src/lib/data/tableHelpers';
	import { fmtDate } from '$src/lib/utils';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap;
	let mapContainerElement: HTMLDivElement | undefined = $state();
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
		console.log('HomePageMap onMount', mapContainerElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e: ml.MapMouseEvent) => {
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

	const startDate = $derived.by(() => {
		// sitesTables;
		const tables = sites.allEnabled.map((s) => sitesTables.get(s.id)).filter((t) => t);
		const dates = tables.map((t) => t?.get('date')).filter((d) => d) as Date[];
		if (dates.length === 0) return new Date('1990-01-01');
		return new Date(Math.min(...dates.map((d) => d.valueOf())));
	});

	const endDate = $derived.by(() => {
		const tables = sites.allEnabled.map((s) => sitesTables.get(s.id)).filter((t) => t);
		const dates = tables.map((t) => t?.get('date', t.numRows() - 1)).filter((d) => d) as Date[];
		if (dates.length === 0) return new Date();
		// console.log('DATES', dates);
		const maxDate = new Date(Math.max(...dates.map((d) => d.valueOf())));
		// console.log('DATES MAXXX', maxDate);
		return maxDate;
	});

	// $effect(() => console.log('STARTART startDate', startDate));
	// $effect(() => console.log('ENDEND  endDate', endDate));
	// $effect(() => console.log('SELECTED DATE',  mlmComponent.selectedDate));

	function markerColor(site: Site) {
		// return 'red';
		return siteVariableColor(site.id, mlmComponent.selectedVariable, mlmComponent.selectedDate);
	}

	function selectedVariableLabel() {
		return variablesMetadata[mlmComponent.selectedVariable]?.label || mlmComponent.selectedVariable;
	}

	function selectedVariableUnit() {
		return (variablesMetadata[mlmComponent.selectedVariable]?.unit || '') + ' ';
	}

	function selectedDateVariableValue(site: Site) {
		const val = siteGetBeforeDate(site, mlmComponent.selectedVariable, mlmComponent.selectedDate);
		return val || 'N/A';
	}

	function selectedDateClosestBeforeDate(site: Site) {
		const date = siteGetBeforeDate(site, 'date', mlmComponent.selectedDate);
		if (date instanceof Date && !isNaN(date.valueOf())) {
			return fmtDate(date);
		}
		return 'N/A';
	}

	$effect(() => {
		// console.log('sites.allEnabled', sites.allEnabled);
	});

	let markersContainer = $state<HTMLDivElement>();

	function getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	$effect(() => {
		sites.allEnabled; // when this is updated markers are rebuilt
		mlmComponent.selectedDate;
		// console.log('SELECTEDDDD DATE', mlmComponent.selectedDate);
		const markers = mapContainerElement?.querySelectorAll('.marker');
		// console.log('# MARKERS', markers?.length);
		if (markers && markers.length > 0) {
			for (let i = 0; i < markers.length; i++) {
				const m = markers.item(i) as HTMLElement;
				const sid = m.getAttribute('data-site-id') as string;
				// console.log(sid)
				// console.log(m);
				// m.style.setProperty('--color', getRandomColor());
				m.style.setProperty(
					'--color',
					siteVariableColor(sid, mlmComponent.selectedVariable, mlmComponent.selectedDate)
				);
			}
			// const m0 = markers.item(0) as HTMLElement;
			// console.log(m0);
			// m0.style.setProperty('--color', 'red');
		}
	});
</script>

{#snippet variableValueBeforeDate(site: Site)}
	<p>
		{selectedVariableLabel()}: {selectedDateVariableValue(site)}
		{selectedVariableUnit()}({selectedDateClosestBeforeDate(site)})
	</p>
{/snippet}

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
		{@render variableValueBeforeDate(hoveredSite)}
		{#if hoveredSiteStats}
			<TooltipSiteStats stats={hoveredSiteStats} />
		{/if}
	{/if}
{/snippet}

<MapLibreMap
	bind:this={mlmComponent}
	{addSources}
	{addLayers}
	bind:divElement={mapContainerElement}
	bind:mlMap
	{...others}
	{startDate}
	{endDate}
	zoom={7.9}
/>

{#if mlMap}
	<!-- {#each sites.allEnabled as site (`${site.id}- ${mlmComponent.selectedVariable}-${mlmComponent.selectedDate?.valueOf()}`)} -->
	{#each sites.allEnabled as site (site.id)}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} color={ghost} />
		<!-- <Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} color={markerColor(site)} /> -->
	{/each}
{/if}

<style>
</style>
