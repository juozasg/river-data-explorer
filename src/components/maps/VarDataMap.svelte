<script lang="ts">
	import * as ml from "maplibre-gl";
	import DataMapControls from "./DataMapControls.svelte";

	import VarDataMarkers from "./VarDataMarkers.svelte";

	import type { MapLibreMapProps } from "$src/lib/types/components";
	import MapLibreMap from "./MapLibreMap.svelte";

	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import type { RegionFeature } from "$src/appstate/data/features.svelte";
	import { MapFeatureSelectionState, toggleHoveredFeatureState } from "$src/appstate/map/featureState.svelte";
	import { sites as globalSites, Sites } from "$src/appstate/sites.svelte";
	import { defaultLayersParams, setEnabledDatasets } from "$src/appstate/ui/layers.svelte";
	import { type MapLayersParams } from "$src/lib/types/mapControls";
	import type { Site } from "$src/lib/types/site";
	import { todayDate } from "$src/lib/utils/date";
	import { onMount } from "svelte";
	import VarDataHoveredFeatures from "./VarDataHoveredFeatures.svelte";
	import { aremove } from "$src/lib/utils/arrays";

	type Props = {
		dataSelection: DataSelectionState;
		selectedRegion?: MapFeatureSelectionState;
		selectedRiver?: MapFeatureSelectionState;
		selectedSite?: Site;
		showRegionTooltip?: boolean;
		varname?: string;
		vardate?: Date;
		layersParams?: MapLayersParams;

		onMapClick?: (map: ml.Map, p: ml.PointLike, site?: Site, region?: RegionFeature, river?: RegionFeature) => void;
		onSearchItemSelect?: (item: Site) => void;
	} & Partial<MapLibreMapProps>;

	// let layersParams = $state<MapLayersParams>(defaultLayersParams);
	// export function

	let {
		selectedRegion,
		selectedRiver,
		selectedSite,
		onMapClick,
		onSearchItemSelect,
		showRegionTooltip = true,
		dataSelection,
		varname = $bindable("ecoli"),
		vardate = $bindable(todayDate),
		layersParams = $bindable(defaultLayersParams),
		...others
	}: Props = $props();

	let _mlmComponent = $state<MapLibreMap>();
	export const mlmComponent = () => _mlmComponent;

	let clientWidth = $state(0);

	$effect(() => {
		setEnabledDatasets(aremove(globalSites.allDatasets, "usgs"));
		// setEnabledDatasets(['sjrbc']);
	});

	const sites = $derived(globalSites.allEnabled);
	const emphasizedSites = $derived(Sites.forRegionFeature(sites, selectedRegion?.feature));

	let mlMap = $state<ml.Map>();
	export const mlmMap = () => mlMap;

	let _hoveredSite = $state<Site>();
	export const hoveredSite = () => _hoveredSite;
	export const hoveredRegion = new MapFeatureSelectionState((c, u) =>
		toggleHoveredFeatureState(mlMap, c, u, selectedRegion?.feature, _hoveredSite)
	);
	export const hoveredRiver = new MapFeatureSelectionState((c, u) =>
		toggleHoveredFeatureState(mlMap, c, u, undefined, undefined)
	);

	onMount(() => {
		mlMap!.on("click", (e) => onMapClick?.(mlMap!, e.point, _hoveredSite, hoveredRegion.feature, hoveredRiver.feature));
		_mlmComponent?.mapDivElement()?.addEventListener("mouseleave", () => {
			hoveredRegion.feature = undefined;
			hoveredRiver.feature = undefined;
		});
	});

	let dataMapControls = $state<DataMapControls>();
	export function setDate(d: Date) {
		dataMapControls?.setDate(d);
	}

	// $effect(() => {
	// 	console.log('VDM vardate', vardate)
	// });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height:100%" bind:clientWidth>
	<DataMapControls
		bind:this={dataMapControls}
		{sites}
		{selectedSite}
		{onSearchItemSelect}
		bind:layersParams
		bind:varname
		bind:vardate
		mapWidth={clientWidth} />

	<MapLibreMap bind:this={_mlmComponent} bind:mlMap {layersParams} {...others} />
</div>

{#if mlMap}
	<VarDataHoveredFeatures
		{selectedRegion}
		{showRegionTooltip}
		{mlMap}
		site={_hoveredSite}
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
		ghostSitesVisible={layersParams.ghostSitesVisible}
		yVarSite={dataSelection.yVar ? dataSelection.ySite : undefined}
		zVarSite={dataSelection.zVar ? dataSelection.zSite : undefined}
		{emphasizedSites}
		{selectedSite}
		bind:hoveredSite={_hoveredSite}
		{...others} />
{/if}

<style>
</style>
