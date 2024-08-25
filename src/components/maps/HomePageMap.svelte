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
	import { fmtDate, UTCDayDate, varunits } from '$src/lib/utils';
	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from '$src/lib/data/dateStats';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap | undefined = $state();
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


	const startDate = $derived(sitesEarliestDate(sites.allEnabled));
	const endDate = $derived(sitesLatestDate(sites.allEnabled));
	const someDates = ['2000-01-11', '2000-01-20', '2010-01-01',  '2023-08-08', '2023-08-9'].map(d => UTCDayDate(d))




	const varname = $derived(mlmComponent?.selectedVariable || 'temp');
	const selectedDate = $derived(mlmComponent?.selectedDate || endDate);

	let validDates: Date[] = $derived(sitesValidDates(sites.allEnabled, varname));

	// $effect(() => {
	// 	const nextDay = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() + 1));
	// 	// TODO: test exclusign start end
	// 	validDates = [startDate, nextDay, ...someDates, endDate];
	// });


	$effect(() => {
		sitesValidDates(sites.allEnabled, varname);
	});


	// $effect(() => {
	// 	console.log('HOME startDate', startDate.toISOString());
	// 	console.log('HOME endDate', endDate.toISOString());
	// });


	function markerColor(site: Site) {
		// return 'red';
		return siteVariableColor(site.id, varname, selectedDate);
	}

	function selectedVariableLabel() {
		return variablesMetadata[varname]?.label || varname;
	}

	function selectedVariableUnit() {
		return varunits(varname, false);
	}

	function selectedDateVariableValue(site: Site) {
		const val = siteGetBeforeDate(site, varname, selectedDate);
		return val || 'N/A';
	}

	function selectedDateClosestBeforeDate(site: Site) {
		const date = siteGetBeforeDate(site, 'date', selectedDate);
		if (date instanceof Date && !isNaN(date.valueOf())) {
			return fmtDate(date);
		}
		return 'N/A';
	}

	let markersContainer = $state<HTMLDivElement>();

	$effect(() => {
		sites.allEnabled; // when this is updated markers are rebuilt
		mlmComponent?.selectedDate;
		// console.log('SELECTEDDDD DATE', selectedDate);
		const markers = mapContainerElement?.querySelectorAll('.marker');
		// console.log('# MARKERS', markers?.length);
		if (markers && markers.length > 0) {
			for (let i = 0; i < markers.length; i++) {
				const m = markers.item(i) as HTMLElement;
				const sid = m.getAttribute('data-site-id') as string;
				// console.log(sid)
				// console.log(m);
				// m.style.setProperty('--color', getRandomColor());
				const color = siteVariableColor(sid, varname, selectedDate);
				m.style.setProperty(
					'--color',
					color
				);

				if(color === ghost) {
					m.style.opacity = '0.4';
				} else {
					m.style.opacity = '1';
				}
			}
			// const m0 = markers.item(0) as HTMLElement;
			// console.log(m0);
			// m0.style.setProperty('--color', 'red');
		}
	});
</script>

{#snippet variableValueBeforeDate(site: Site)}
	<p>
		{selectedVariableLabel()}: <u><b>{selectedDateVariableValue(site)}</b></u>
		{selectedVariableUnit()} ({selectedDateClosestBeforeDate(site)})
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
	{validDates}
	zoom={7.9}
/>

{#if mlMap}
	{#each sites.allEnabled as site (site.id)}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} color={ghost} />
		<!-- <Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} color={markerColor(site)} /> -->
	{/each}
{/if}

<style>
</style>
