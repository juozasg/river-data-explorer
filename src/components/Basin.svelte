<script lang="ts">
	import { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { regionFeatures, type RegionFeature, type RegionType } from "$src/appstate/data/features.svelte";
	import { MapFeatureSelectionState, toggleSelectedFeatureState } from "$src/appstate/map/featureState.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import BasinChart from "$src/components/basin/BasinChart.svelte";
	import BasinHeader from "$src/components/basin/BasinHeader.svelte";
	import RegionStatsPanel from "$src/components/basin/stats/RegionStatsPanel.svelte";
	import SiteStatsPanel from "$src/components/basin/stats/SiteStatsPanel.svelte";
	import InlineBlockIconify from "$src/components/maps/controls/InlineBlockIconify.svelte";
	import VarDataMap from "$src/components/maps/VarDataMap.svelte";
	import { defaultLayersParams } from "$src/lib/types/mapControls";
	import type { Site } from "$src/lib/types/site";
	import { chartYColor } from "$src/lib/utils/colors";
	import { fitFeatureBounds } from "$src/lib/utils/maplibre";
	import * as ml from "maplibre-gl";

	const dataSelection: DataSelectionState = new DataSelectionState();
	let varDataMap = $state<VarDataMap>();

	const updatedRegionSelection = (curr?: RegionFeature, u?: RegionFeature) => {
		toggleSelectedFeatureState(varDataMap?.mlmMap(), curr, u);
	};

	const selectedRegion = new MapFeatureSelectionState(updatedRegionSelection);
	let selectedSite = $state<Site>();

	let layersParams = $state(defaultLayersParams);
	function onClickRegionType(regionType: string) {
		// console.log("regionType", regionType);
		layersParams.regionType = regionType as RegionType;
	}

	$effect(() => {
		dataSelection.ySite = sites.findById("sjrbc-1");
		dataSelection.yVar = "ph";
		dataSelection.zSite = sites.findById("invert-5");
		dataSelection.zVar = "invertNarrative";
	});

	const onDateSelect = (d: Date) => {
		console.log("date selected", d);
	};
	const onMapClick = (map: ml.Map, p: ml.PointLike, site?: Site, region?: RegionFeature, river?: RegionFeature) => {
		console.log("map clicked", map, p, site, region, river);

		// clicking a site in another region will select that region
		// only if no region is already selected
		if (!selectedRegion.feature) selectedRegion.feature = region;
		if (!site) selectedRegion.feature = region;

		// only clear site selection if clicking outside any region
		if (site || !region) selectedSite = site;
	};

	const onSearchItemSelect = (item: Site) => {
		// console.log("search ÷item selected", item);
		selectedSite = item;
	};

	const onHeaderClose = () => {
		selectedRegion.feature = undefined;
		varDataMap;
	};

	$effect(() => {
		if (selectedRegion.feature) {
			mapWidth = "calc(50vw - 2rem)";
			mapHeight = "calc(50vh - 5rem)";
			const feature = selectedRegion.feature;
			setTimeout(() => {
				fitFeatureBounds(varDataMap?.mlmMap()!, feature);
			}, 300);
		} else {
			mapWidth = "calc(100vw - 3.5rem)";
			mapHeight = "calc(100vh - 5rem)";
			const feature = regionFeatures.get("huc8", "04050001");
			setTimeout(() => {
				if (feature) fitFeatureBounds(varDataMap?.mlmMap()!, feature);
			}, 300);
		}

		// console.log("mapWidth", mapWidth);
	});

	// $effect(() => {
	// 	console.log("ySite full Table", sitesTables.get(dataSelection.ySite?.id || "")?.objects());
	// 	console.log("zSite full Table", sitesTables.get(dataSelection.zSite?.id || "")?.objects());
	// });

	let mapWidth = $state("calc(100vw - 3rem)");
	let mapHeight = $state("calc(100vh - 5rem)");

	// let siteStatsVarHoverColor = $derived(
	// 	clickAssignsYAxis ? chartYColor + '33' : chartZColor + '33'
	// );

	let siteStatsVarHoverColor = chartYColor + "33";

	let varname = $state("ecoli");
	function regionTableVarClicked(vn: string) {
		varname = vn;
	}
	function siteTableVarClicked(varname: string, axis: "y" | "z") {
		if (axis === "y") {
			dataSelection.yVar = varname;
			dataSelection.ySite = selectedSite;
		} else {
			dataSelection.zVar = varname;
			dataSelection.zSite = selectedSite;
		}
	}
</script>

<!-- <h5>Test basin workflow</h5> -->

<div class="workflow-header">
	<BasinHeader
		regionFeature={selectedRegion.feature}
		{onClickRegionType}
		onClickClose={onHeaderClose}
		regionType={layersParams.regionType} />
</div>
<div class="workflow" style="width: {mapWidth}; height: {mapHeight}">
	<VarDataMap
		{varname}
		{selectedRegion}
		{selectedSite}
		{dataSelection}
		{onMapClick}
		{onSearchItemSelect}
		{layersParams}
		bind:this={varDataMap} />
	<div class="chart">
		<BasinChart {dataSelection} {onDateSelect} />
	</div>

	{#if selectedRegion.feature}
		<div class="region-table">
			<RegionStatsPanel {dataSelection} region={selectedRegion.feature} onVarClicked={regionTableVarClicked} />
		</div>
	{/if}
	{#if selectedSite && selectedRegion.feature}
		<div class="site-table">
			<SiteStatsPanel
				{dataSelection}
				site={selectedSite}
				onVarClicked={siteTableVarClicked}
				hoverColor={siteStatsVarHoverColor} />
		</div>
	{/if}
</div>

<span class="map-attribution">
	Map Sources: Esri, TomTom, Garmin, FAO, NOAA, USGS, © OpenStreetMap contributors, and the GIS User Community. Date
	sources: USGS, <a href='https://sjrbc.com'>St. Joseph River Basin Commission.</a>
	<a class="github" target="_blank" href="https://github.com/Limnogirl90/SJRBC-web-map-data/tree/webapp/datasets"
		>Download Datasets <InlineBlockIconify icon="uiw:github" size="0.9rem" /></a>
</span>

<style>
	.workflow-header {
		width: calc(100vw - 3rem);
		left: 1.5rem;
		top: 1rem;
		height: 42px;
		overflow: hidden;
		position: relative;
	}
	.workflow {
		margin: 1rem;
		margin-left: 1.5rem;
		.chart {
			margin-left: 1rem;
			margin-top: 1rem;
		}

		.region-table {
			position: absolute;
			top: calc(42px + 1rem);
			right: 1.5rem;

			width: calc(50vw - 2rem);
			height: calc(50vh - 5rem);

			/* border: 1px solid aqua; */
		}

		.site-table {
			position: absolute;
			top: calc(50vh - 4rem + 42px);
			right: 1.5rem;
			width: calc(50vw - 2rem);
			height: calc(50vh - 1rem);
			/* border: 1px solid  salmon; */
		}
	}

	.map-attribution {
		white-space: nowrap;
		position: fixed;
		height: 1.2rem;
		overflow: hidden;
		bottom: 0;
		right: 22px;
		font-size: 0.9rem;
		background-color: white;
		color: #acacac;
		/* padding: 0.5rem; */
		margin: 0;
		padding: 0;
		margin-left: 0.5rem;
		/* overflow: scroll; */
		a.github {
			position: relative;
			bottom: -1px;
			font-size: 0.9rem;
			background-color: var(--color-primary);
			color: white;
			padding: 0 6px;
		}
	}
</style>
