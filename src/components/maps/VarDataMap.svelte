<script lang="ts">
	import * as ml from "maplibre-gl";
	import DataMapControls from "./DataMapControls.svelte";

	import VarDataMarkers from "./VarDataMarkers.svelte";

	import type { MapLibreMapProps } from "$src/lib/types/components";
	import MapLibreMap from "./MapLibreMap.svelte";

	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { MapFeatureSelectionState, toggleHoveredFeatureState } from "$src/appstate/map/featureState.svelte";
	import { sites as globalSites, Sites } from "$src/appstate/sites.svelte";
	import { setEnabledDatasets } from "$src/appstate/ui/layers.svelte";
	import { defaultLayersParams, type MapLayersParams } from "$src/lib/types/mapControls";
	import type { Site } from "$src/lib/types/site";
	import { aremove, UTCDayDate } from "$src/lib/utils";
	import { onMount } from "svelte";
	import VarDataHoveredFeatures from "./VarDataHoveredFeatures.svelte";

	type Props = {
		dataSelection: DataSelectionState;
		selectedRegion?: MapFeatureSelectionState;
		selectedRiver?: MapFeatureSelectionState;
		selectedSite?: Site;
		showRegionTooltip?: boolean;
		varname?: string;
		vardate?: Date;

		mapClick?: (map: ml.Map, p: ml.PointLike) => void;
		searchItemSelect?: (item: Site) => void;
	} & Partial<MapLibreMapProps>;

	// export function

	let {
		selectedRegion,
		selectedRiver,
		selectedSite,
		mapClick,
		searchItemSelect,
		showRegionTooltip = true,
		dataSelection,
		varname = $bindable("ecoli"),
		vardate = $bindable(UTCDayDate()),
		...others
	}: Props = $props();

	let _mlmComponent = $state<MapLibreMap>();
	export const mlmComponent = () => _mlmComponent;

	let clientWidth = $state(0);

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

	let layersParams = $state<MapLayersParams>(defaultLayersParams);

	onMount(() => {
		mlMap!.on("click", (e) => mapClick && mapClick(mlMap!, e.point));
	});

	let dataMapControls = $state<DataMapControls>();
	export function setInternalDate(d: Date) {
		dataMapControls?.setInternalDate(d);
	}

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height:100%" bind:clientWidth>
	<DataMapControls
		bind:this={dataMapControls}
		{sites}
		{selectedSite}
		{searchItemSelect}
		bind:layersParams
		bind:varname
		bind:vardate
		mapWidth={clientWidth} />
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
		yVarSite={dataSelection.yVar ? dataSelection.ySite : undefined}
		zVarSite={dataSelection.zVar ? dataSelection.zSite : undefined}
		{emphasizedSites}
		{selectedSite}
		bind:hoveredSite={_hoveredSite}
		{...others} />
{/if}

<style>
</style>
