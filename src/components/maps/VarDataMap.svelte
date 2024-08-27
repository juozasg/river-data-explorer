<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { MLMHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import { formatLngLat } from '$src/lib/copyLngLat';
	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from '$src/lib/data/dateStats';
	import { siteVariableColor } from '$src/lib/data/map/helpers/markerHelpers';
	import { sitesDataStats } from '$src/lib/data/stats';
	import { siteGetBeforeDate } from '$src/lib/data/tableHelpers';
	import type { MapLayersParams } from '$src/lib/types/mapControls';
	import type { Site } from '$src/lib/types/site';
	import { fmtDate } from '$src/lib/utils';
	import { ghost } from '$src/lib/utils/colors';
	import { varunits } from '$src/lib/utils/varHelpers';
	import TooltipSiteStats from '../tooltips/TooltipContentSiteStats.svelte';
	import LayerSwitcher from './controls/LayerSwitcher.svelte';
	import Legend from './controls/Legend.svelte';
	import TimeSelector from './controls/TimeSelector.svelte';
	import VariableSelector from './controls/VariableSelector.svelte';
	import Marker from './Marker.svelte';

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
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = null;
	};

	$effect(() => {
		sitesValidDates(sites.allEnabled, varname);
	});

	function selectedVariableLabel() {
		return variablesMetadata[varname]?.label || varname;
	}

	function selectedVariableUnit() {
		return varunits(varname);
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

	const startDate = $derived(sitesEarliestDate(sites.allEnabled));
	const endDate = $derived(sitesLatestDate(sites.allEnabled));

	let variableSelector: VariableSelector | undefined = $state();
	let timeSelector: TimeSelector | undefined = $state();

	const varname = $derived(mlmComponent?.selectedVariable || 'temp');
	const selectedDate = $derived(mlmComponent?.selectedDate || endDate);

	let validDates: Date[] = $derived(sitesValidDates(sites.allEnabled, varname));

	$effect(() => {
		sites.allEnabled; // when this is updated markers are rebuilt
		mlmComponent?.selectedDate;
		const markers = mapContainerElement?.querySelectorAll('.marker');
		if (markers && markers.length > 0) {
			for (let i = 0; i < markers.length; i++) {
				const m = markers.item(i) as HTMLElement;
				const sid = m.getAttribute('data-site-id') as string;

				const color = siteVariableColor(sid, varname, selectedDate);
				m.style.setProperty('--color', color);

				if (color === ghost) {
					m.classList.add('ghost');
				} else {
					m.classList.remove('ghost');
				}
			}
		}
	});

	let layersParams = $state<MapLayersParams>({
		baseStyleId: 'TOPO',
		riverLayerVisible: true
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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height: 100%">
	{#if mapMouseLocation.lngLat}
		<pre class="copy-debug">{formatLngLat(mapMouseLocation.lngLat, 4)} (C to copy)</pre>
	{/if}
	<LayerSwitcher bind:layersParams />
	<VariableSelector bind:this={variableSelector} />
	<TimeSelector {startDate} {endDate} {validDates} bind:this={timeSelector} />
	<Legend varname={varname} />
	<MapLibreMap
		bind:this={mlmComponent}
		bind:mlMap
		{layersParams}
		zoom={7.9}
		{...others}
	/>
</div>

{#if mlMap}
	{#each sites.allEnabled as site (site.id)}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} color={ghost} />
	{/each}
{/if}

<style>


pre.copy-debug {
		position: absolute;
		top: 0px;
		right: -2px;
		z-index: 2;
		background: none;
		padding: 0.5rem;
		pointer-events: none;
	}
</style>
