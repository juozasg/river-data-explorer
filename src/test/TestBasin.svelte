<script lang="ts">
	import { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import BasinChart from "$src/components/basin/BasinChart.svelte";
	import BasinHeader from "$src/components/basin/BasinHeader.svelte";
	import VarDataMap from "$src/components/maps/VarDataMap.svelte";

	const dataSelection: DataSelectionState = new DataSelectionState();

	$effect(() => {
		dataSelection.ySite = sites.findById("sjrbc-1");
		dataSelection.yVar = "ph";
		dataSelection.zSite = sites.findById("invert-5");
		dataSelection.zVar = "invertNarrative";
	});

	const onDateSelected = (d: Date) => {
		console.log("date selected", d);
	};

	$effect(() => {
		console.log("ySite full Table", sitesTables.get(dataSelection.ySite?.id || "")?.objects());
		console.log("zSite full Table", sitesTables.get(dataSelection.zSite?.id || "")?.objects());
	});
</script>

<h5>Test basin workflow</h5>
<div class="test-container" style="margin: 1rem; width:800px; height: 1000px">
	<BasinHeader />
	<VarDataMap {dataSelection} />
	<BasinChart {dataSelection} {onDateSelected} />

	<!-- <BasinChart
		{dataSelection}
		{onDateSelected}
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
