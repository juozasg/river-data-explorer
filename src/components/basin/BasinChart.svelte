<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import type { RegionFeature } from "$src/appstate/data/features.svelte";
	import { sites, siteTablesForRegion } from "$src/appstate/sites.svelte";
	import { varDailyMedian } from "$src/lib/data/stats";
	import { selectTableVar } from "$src/lib/data/siteTableHelpers";
	import type { Site } from "$src/lib/types/site";
	import { varChartDomain, YZChartParams } from "$src/lib/utils/YZChartParams";
	import BrushedYzChart from "../chart/BrushedYZChart.svelte";
	import InlineBlockIconify from "../maps/controls/InlineBlockIconify.svelte";

	type Props = {
		dataSelection: DataSelectionState;

		onDateSelect?: (d: Date) => void;
	};

	const { dataSelection, onDateSelect }: Props = $props();

	const yTable = $derived.by(() => {
		if (dataSelection.ySite && dataSelection.yVar) {
			const table = sitesTables.get(dataSelection.ySite.id);
			return selectTableVar(table, dataSelection.yVar, "y");
		}

		if (dataSelection.yRegion && dataSelection.yVar) {
			const tables = siteTablesForRegion(sites.allEnabled, dataSelection.yRegion);
			const dailyMediansTable = varDailyMedian(tables, dataSelection.yVar);
			// console.log('dailyMediansTable', dailyMediansTable.objects());
			return selectTableVar(dailyMediansTable, dataSelection.yVar, "y");
		}
	});

	const zTable = $derived.by(() => {
		if (dataSelection.zSite && dataSelection.zVar) {
			const table = sitesTables.get(dataSelection.zSite.id);
			return selectTableVar(table, dataSelection.zVar, "z");
		}

		if (dataSelection.zRegion && dataSelection.zVar) {
			const tables = siteTablesForRegion(sites.allEnabled, dataSelection.zRegion);
			const dailyMediansTable = varDailyMedian(tables, dataSelection.zVar);
			return selectTableVar(dailyMediansTable, dataSelection.zVar, "z");
		}
	});

	const yzTable = $derived.by(() => {
		// react to changes in yTable or zTable
		yTable?.objects();
		zTable?.objects();
		if (yTable && zTable) {
			// console.log("joining tables");
			return yTable.join_full(zTable, "date").orderby("date").reify();
		}

		return yTable ?? zTable;
	});

	const yDomain = $derived(varChartDomain("y", dataSelection.yVar, yzTable));
	const zDomain = $derived(varChartDomain("z", dataSelection.zVar, yzTable));

	const forceDomain: [number, number] | undefined = $derived.by(() => {
		if (dataSelection.yVar == dataSelection.zVar) {
			const minDomain = Math.min(yDomain[0], zDomain[0]);
			const maxDomain = Math.max(yDomain[1], zDomain[1]);

			return [minDomain, maxDomain];
		}
		return;
	});

	function locationName(site?: Site, region?: RegionFeature) {
		if (site) {
			return site.name + ` (${site.id.replace(/-/, "&#8209;")})`; // non-breaking hyphen
		}
		if (region) {
			return region.name + ` (${region.regionType}&nbsp;${region.id})`;
		}

		return ""
	}

	let yParams = $derived(
		new YZChartParams(
			"y",
			dataSelection.yVar || "",
			yzTable,
			locationName(dataSelection.ySite, dataSelection.yRegion),
			forceDomain ?? yDomain
		)
	);
	let zParams = $derived(
		new YZChartParams(
			"z",
			dataSelection.zVar || "",
			yzTable,
			locationName(dataSelection.zSite, dataSelection.zRegion),
			forceDomain ?? zDomain
		)
	);

	$effect(() => {
		console.log("yParams", yParams);
		console.log("zParams", zParams);
		console.log("yzTable", yzTable?.objects());
	});
</script>

{#if yzTable && yParams && zParams}
	<BrushedYzChart {yzTable} {yParams} {zParams} {onDateSelect} />
{:else}
	<!-- <div class="arrrow-icon"> -->
	<h3>
		<InlineBlockIconify icon="lets-icons:expand-up" size="2rem" />
		Click site markers to select sites
		<!-- </div> -->

		<InlineBlockIconify icon="lets-icons:expand-up" size="2rem" />
	</h3>
	<!-- <div class="arrrow-icon"> -->
	<!-- </div> -->
	<h3>
		Use <span class='graph-buttons'><span class="graph-button y">Y</span></span> and <span class='graph-buttons'><span class="graph-button z">Z</span></span> buttons to graph site variables
		<InlineBlockIconify icon="lets-icons:expand-right" size="2rem" />
	</h3>

	<br/>
{/if}

<style>
	h3 :global(.icon) {
		position: relative;
		top: 0.5rem;
	}
	.graph-button {
		/* margin-bottom: 3px; */
		position: relative;


		bottom: 0px;
		padding-bottom: 1px;
	}

	.graph-buttons {
		display: inline;
		position: relative;
		margin-right: 4px;

		.z, .y {
			margin-right: 5px;
		}


	}
	/*
	.y-button-label {
		color: var(--color-chart-y);
	}
	.z-button-label {
		color: var(--color-chart-z);
	} */
</style>
