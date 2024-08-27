<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';
  import VarDataMarkers from './VarDataMarkers.svelte';
	import MapLatLonDebug from './MapLatLonDebug.svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { MLMHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from '$src/lib/data/dateStats';
	import { sitesDataStats } from '$src/lib/data/stats';
	import { siteGetBeforeDate } from '$src/lib/data/tableHelpers';
	import type { MapLayersParams } from '$src/lib/types/mapControls';
	import type { Site } from '$src/lib/types/site';
	import { fmtDate, UTCDayDate } from '$src/lib/utils';
	import { varlabel, varunits } from '$src/lib/utils/varHelpers';
	import TooltipSiteStats from '../tooltips/TooltipContentSiteStats.svelte';
	import LayerSwitcher from './controls/LayerSwitcher.svelte';
	import Legend from './controls/Legend.svelte';
	import TimeSelector from './controls/TimeSelector.svelte';
	import VariableSelector from './controls/VariableSelector.svelte';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent = $state<MapLibreMap>();
	let mlMap = $state<ml.Map>();

	const hoveredRiver = new MLMHoveredFeatureState(10);
	const hoveredRegion = new MLMHoveredFeatureState();
	let hoveredSite: Site | null = $state(null);

	const hoveredSiteStats = $derived(hoveredSite ? sitesDataStats([hoveredSite]) : undefined);

	const hoveredAreaSites = $derived(
		sites.allEnabled.filter((s) => hoveredRegion.id && s.huc10 === hoveredRegion.id)
	);

	const hoveredAreaStats = $derived(
		hoveredAreaSites.length > 0 ? sitesDataStats(hoveredAreaSites) : undefined
	);

	onMount(() => {
		console.log('HomePageMap onMount', mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e: ml.MapMouseEvent) => {
			hoveredRiver.mouseMove(e, ['riverapp-river']);
			hoveredRegion.mouseMove(e, ['riverapp-huc10']);

			if (hoveredRiver.feature || hoveredSite || hoveredRegion.feature) {
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
			} else {
				tooltip.hide();
			}
		});
	});


	function selectedDateClosestBeforeDate(site: Site) {
		const date = siteGetBeforeDate(site, 'date', vardate);
		if (date instanceof Date && !isNaN(date.valueOf())) {
			return fmtDate(date);
		}
		return 'N/A';
	}

	let varname = $state('temp');
	let vardate = $state(UTCDayDate());

	const startDate = $derived(sitesEarliestDate(sites.allEnabled));
	const endDate = $derived(sitesLatestDate(sites.allEnabled));
	let validDates: Date[] = $derived(sitesValidDates(sites.allEnabled, varname));

	let layersParams = $state<MapLayersParams>({
		baseStyleId: 'TOPO',
		riverLayerVisible: true
	});
</script>

{#snippet variableValueBeforeDate(site: Site)}
	{@const val = siteGetBeforeDate(site, varname, vardate)}
	<p>
		{#if val}
			{varlabel(varname)}: <u><b>{val}</b></u> {varunits(varname)} ({selectedDateClosestBeforeDate(site)})
		{:else}
			{varlabel(varname)}: <span style="color: #888">N/A</span>
		{/if}
	</p>
{/snippet}

{#snippet tooltipContent()}
	{#if hoveredRegion.feature}
		<h5>Watershed: {hoveredRegion.name}</h5>
		<i>HUC10: {hoveredRegion.id}</i>
		{#if hoveredRegion.feature}
			<p><b>{sites.inHuc10(hoveredRegion.feature.id).length}</b> sites</p>
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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height: 100%">
	<MapLatLonDebug />
	<LayerSwitcher bind:layersParams />
	<VariableSelector bind:varname />
	<TimeSelector {startDate} {endDate} {validDates} bind:vardate />
	<Legend {varname} />
	<MapLibreMap bind:this={mlmComponent} bind:mlMap {layersParams} zoom={7.9} {...others} />
</div>

{#if mlMap}
	<VarDataMarkers {mlMap} {varname} {vardate} sites={sites.allEnabled} bind:hoveredSite/>
{/if}

<style>
</style>
