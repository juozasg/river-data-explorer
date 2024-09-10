<script lang="ts">
	import * as ml from "maplibre-gl";
	import MapLatLonDebug from "./MapLatLonDebug.svelte";
	import VarDataMarkers from "./VarDataMarkers.svelte";

	import type { MapLibreMapProps } from "$src/lib/types/components";
	import MapLibreMap from "./MapLibreMap.svelte";

	import { MapFeatureSelectionState, toggleHoveredFeatureState } from "$src/appstate/map/featureState.svelte";
	import { sites as globalSites, Sites } from "$src/appstate/sites.svelte";
	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from "$src/lib/data/dateStats";
	import type { MapLayersParams } from "$src/lib/types/mapControls";
	import type { Site } from "$src/lib/types/site";
	import { aremove, UTCDayDate } from "$src/lib/utils";
	import { onMount } from "svelte";
	import LayerSwitcher from "./controls/LayerSwitcher.svelte";
	import Legend from "./controls/Legend.svelte";
	import TimeSelector from "./controls/TimeSelector.svelte";
	import VariableSelector from "./controls/VariableSelector.svelte";
	import VarDataHoveredFeatures from "./VarDataHoveredFeatures.svelte";
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { setEnabledDatasets } from "$src/appstate/ui/layers.svelte";
	import LayerOptions from "./controls/LayerOptions.svelte";

	type Props = {
		dataSelection: DataSelectionState;
		selectedRegion?: MapFeatureSelectionState;
		selectedRiver?: MapFeatureSelectionState;
		selectedSite?: Site;
		showRegionTooltip?: boolean;
		varname?: string;
		vardate?: Date;

		mapClick?: (map: ml.Map, p: ml.PointLike) => void;
	} & Partial<MapLibreMapProps>;

	// export function

	let {
		selectedRegion,
		selectedRiver,
		selectedSite,
		mapClick,
		showRegionTooltip = true,
		dataSelection,
		varname = $bindable("temp"),
		vardate = $bindable(UTCDayDate()),
		...others
	}: Props = $props();

	let _mlmComponent = $state<MapLibreMap>();
	export const mlmComponent = () => _mlmComponent;

	let clientWidth = $state(0);
	$effect(() => {console.log('CW', clientWidth)});

	$effect(() => {
		setEnabledDatasets(aremove(globalSites.allDatasets, "usgs"));
		// setEnabledDatasets(['sjrbc', 'steuben', 'usgs']);
	});

	const sites = $derived(globalSites.allEnabled);
	const emphasizedSites = $derived(Sites.forRegionFeature(sites, selectedRegion?.feature));

	let mlMap = $state<ml.Map>();
	export const mlmMap = () => mlMap;

	let _hoveredSite = $state<Site>();
	export const hoveredSite = () => _hoveredSite;
	export const hoveredRegion = new MapFeatureSelectionState((c, u) => toggleHoveredFeatureState(mlMap, c, u));
	export const hoveredRiver = new MapFeatureSelectionState((c, u) => toggleHoveredFeatureState(mlMap, c, u));

	const startDate = $derived(sitesEarliestDate(sites));
	const endDate = $derived(sitesLatestDate(sites));
	let validDates: Date[] = $derived(sitesValidDates(sites, varname));

	let layersParams = $state<MapLayersParams>({
		baseStyleId: "TOPO",
		riverLayerVisible: true
	});

	onMount(() => {
		mlMap!.on("click", (e) => mapClick && mapClick(mlMap!, e.point));
	});

	let timeSelector = $state<TimeSelector>();
	export function setInternalDate(d: Date) {
		if (timeSelector) timeSelector.setInternalDate(d);
	}

	const yVarSite = $derived(dataSelection.yVar ? dataSelection.ySite : undefined);
	const zVarSite = $derived(dataSelection.zVar ? dataSelection.zSite : undefined);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height: 100%" bind:clientWidth>
	<div class="controls">
		<MapLatLonDebug />
		<!-- <LayerSwitcher bind:layersParams /> -->
		<LayerOptions mapWidth={clientWidth + 'px'} />
		<!-- <VariableSelector bind:varname /> -->
		<!-- <TimeSelector {startDate} {endDate} {validDates} bind:vardate bind:this={timeSelector} /> -->
		<!-- <Legend {varname} /> -->
	</div>
	<MapLibreMap bind:this={_mlmComponent} bind:mlMap {layersParams} zoom={7.9} {...others} />
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
		{sites} />

	<VarDataMarkers
		{mlMap}
		{varname}
		{vardate}
		{sites}
		{yVarSite}
		{zVarSite}
		{emphasizedSites}
		{selectedSite}
		bind:hoveredSite={_hoveredSite}
		{...others} />
{/if}

<style>
</style>
