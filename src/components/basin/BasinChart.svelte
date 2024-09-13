<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { selectSiteTableVar } from "$src/lib/data/tableHelpers";
	import type { Site } from "$src/lib/types/site";
	import BrushedYZChart from "../chart/BrushedYZChart.svelte";

	type Props = {
		dataSelection: DataSelectionState;

		onDateSelected?: (d: Date) => void;
	};

	const { dataSelection, onDateSelected }: Props = $props();

	// const ySiteTable = $derived(dataSelection.ySite && sitesTables.get(dataSelection.ySite.id));
	// const zSiteTable = $derived(dataSelection.zSite && sitesTables.get(dataSelection.zSite.id));

	const yTable = $derived(selectSiteTableVar(dataSelection.ySite, dataSelection.yVar, "y"));
	const zTable = $derived(selectSiteTableVar(dataSelection.zSite, dataSelection.zVar, "z"));

	const yzTable = $derived.by(() => {
		if (yTable && zTable) {
			console.log('joining tables');
			return yTable.join_full(zTable, "date").orderby("date").reify();
		}

		return yTable ?? zTable;
	});

	$effect(() => {
		console.log('yTable', yTable?.objects());
		console.log('zTable', zTable?.objects());
		console.log('yzTable', yzTable?.objects());
	});
</script>

{#if yzTable}
	<!-- <BrushedYZChart {yzTable} chartWidth={500} chartHeight={500} {onDateSelected} /> -->
{:else}
	<p>No data</p>
{/if}

<style>
</style>
