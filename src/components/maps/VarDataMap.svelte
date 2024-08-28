<script lang="ts">
	import * as ml from 'maplibre-gl';
	import MapLatLonDebug from './MapLatLonDebug.svelte';
	import VarDataMarkers from './VarDataMarkers.svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { MapFeatureSelectionState, toggleHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { sites as globalSites, Sites } from '$src/appstate/sites.svelte';
	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from '$src/lib/data/dateStats';
	import type { MapLayersParams } from '$src/lib/types/mapControls';
	import type { Site } from '$src/lib/types/site';
	import { UTCDayDate } from '$src/lib/utils';
	import { onMount } from 'svelte';
	import LayerSwitcher from './controls/LayerSwitcher.svelte';
	import Legend from './controls/Legend.svelte';
	import TimeSelector from './controls/TimeSelector.svelte';
	import VariableSelector from './controls/VariableSelector.svelte';
	import VarDataHoveredFeatures from './VarDataHoveredFeatures.svelte';

	type Props = {
		selectedSite?: Site;
		yVarSite?: Site;
		zVarSite?: Site;
		selectedRegion?: MapFeatureSelectionState;
		selectedRiver?: MapFeatureSelectionState;
		showRegionTooltip?: boolean;
		mapClick?: (map: ml.Map, p: ml.PointLike) => void;
	} & Partial<MapLibreMapProps>;

	// export function

	let { selectedRegion, selectedRiver,  mapClick, showRegionTooltip = true, ...others }: Props = $props();

	const sites = $derived(globalSites.allEnabled);
	const emphasizedSites = $derived(Sites.inRegionFeature(sites, selectedRegion?.feature));

	let mlMap = $state<ml.Map>();
	export const mlmMap = $derived(mlMap);

	let _hoveredSite = $state<Site>();
	export const hoveredSite = $derived(_hoveredSite);
	export const hoveredRegion = new MapFeatureSelectionState((c, u) =>
		toggleHoveredFeatureState(mlMap, c, u)
	);
	export const hoveredRiver = new MapFeatureSelectionState((c, u) =>
		toggleHoveredFeatureState(mlMap, c, u)
	);

	let varname = $state('temp');
	let vardate = $state(UTCDayDate());

	const startDate = $derived(sitesEarliestDate(sites));
	const endDate = $derived(sitesLatestDate(sites));
	let validDates: Date[] = $derived(sitesValidDates(sites, varname));

	let layersParams = $state<MapLayersParams>({
		baseStyleId: 'TOPO',
		riverLayerVisible: true
	});

	onMount(() => {
		mlMap!.on('click', (e) => mapClick && mapClick(mlMap!, e.point));
	});


</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height: 100%">
	<MapLatLonDebug />
	<LayerSwitcher bind:layersParams />
	<VariableSelector bind:varname />
	<TimeSelector {startDate} {endDate} {validDates} bind:vardate />
	<Legend {varname} />
	<MapLibreMap bind:mlMap {layersParams} zoom={7.9} {...others} />
</div>

{#if mlMap}
	<VarDataHoveredFeatures
		{showRegionTooltip}
		{mlMap}
		hoveredSite={_hoveredSite}
		{hoveredRegion}
		{hoveredRiver}
		{varname}
		{vardate}
		{sites}
	/>

	<VarDataMarkers
		{mlMap}
		{varname}
		{vardate}
		{sites}
		{emphasizedSites}
		bind:hoveredSite={_hoveredSite}
		{...others}
	/>
{/if}

<style>
</style>
