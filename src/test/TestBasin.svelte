<script lang="ts">
	import * as ml from "maplibre-gl";
	import { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import type { RegionFeature, RegionType } from "$src/appstate/data/features.svelte";
	import { MapFeatureSelectionState } from "$src/appstate/map/featureState.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import BasinChart from "$src/components/basin/BasinChart.svelte";
	import BasinHeader from "$src/components/basin/BasinHeader.svelte";
	import VarDataMap from "$src/components/maps/VarDataMap.svelte";
	import type { Site } from "$src/lib/types/site";
	import { defaultLayersParams } from "$src/lib/types/mapControls";

	const dataSelection: DataSelectionState = new DataSelectionState();

	const updatedRegionSelection = (curr?: RegionFeature, u?: RegionFeature) => {
		// toggleSelectedFeatureState(regionSelectionMap?.mlmMap(), curr, u);
		// toggleSelectedFeatureState(detailsMap?.mlmMap(), curr, u);
		// if (u && detailsMap?.mlmMap()) {
		// 	fitFeatureBounds(detailsMap.mlmMap()!, u);
		// }
		// // region selection changed, focus details map
		// if (u) {
		// 	const regionDetailsA = window.document.getElementById('region-details');
		// 	regionDetailsA?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		// 	detailsMap?.setDate(regionMapVardate);
		// 	detailMapVarname = regionMapVarname;
		// }
	};

	const selectedRegion = new MapFeatureSelectionState(updatedRegionSelection);

	let layersParams = $state(defaultLayersParams);
	function onClickRegionType(regionType: string) {
		console.log("regionType", regionType);
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
		selectedRegion.feature = region;
	};

	const onSearchItemSelect = (item: Site) => {
		console.log("search item selected", item);
	};

	// $effect(() => {
	// 	console.log("ySite full Table", sitesTables.get(dataSelection.ySite?.id || "")?.objects());
	// 	console.log("zSite full Table", sitesTables.get(dataSelection.zSite?.id || "")?.objects());
	// });

</script>

<!-- <h5>Test basin workflow</h5> -->

<div class="header-test" style="width: 100%">
	<!-- <BasinHeader /> -->
</div>
<div class="test-container" style="margin: 1rem; width: 700px; height: 1000px">
	<BasinHeader regionFeature={selectedRegion.feature} {onClickRegionType} regionType={layersParams.regionType} />
	<VarDataMap {dataSelection} {onMapClick} {onSearchItemSelect} {layersParams} />
	<BasinChart {dataSelection} {onDateSelect} />

	<!-- <BasinChart
		{dataSelection}
		{onDateSelect}
	/> -->
</div>

<style>
	h5 {
		margin: 0.5rem;
	}

	.test-container {
		/* border: 1px solid #ccc; */
	}
</style>
