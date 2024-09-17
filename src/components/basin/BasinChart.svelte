<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { selectSiteTableVar } from "$src/lib/data/tableHelpers";
	import type { Site } from "$src/lib/types/site";
	import { varChartDomain, YZChartParams } from "$src/lib/utils/YZChartParams";
	import BrushedYzChart from "../chart/BrushedYZChart.svelte";
	import InlineBlockIconify from "../maps/controls/InlineBlockIconify.svelte";

	type Props = {
		dataSelection: DataSelectionState;

		onDateSelect?: (d: Date) => void;
	};

	const { dataSelection, onDateSelect }: Props = $props();

	const yTable = $derived(selectSiteTableVar(dataSelection.ySite, dataSelection.yVar, "y"));
	const zTable = $derived(selectSiteTableVar(dataSelection.zSite, dataSelection.zVar, "z"));

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

	function locationName(site?: Site) {
		if (!site) return "";
		return site.name + ` (${site.id.replace(/-/, "&#8209;")})`; // non-breaking hyphen
	}

	let yParams = $derived(
		new YZChartParams("y", dataSelection.yVar || "", yzTable, locationName(dataSelection.ySite), forceDomain ?? yDomain)
	);
	let zParams = $derived(
		new YZChartParams("z", dataSelection.zVar || "", yzTable, locationName(dataSelection.zSite), forceDomain ?? zDomain)
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
		Use <tt>Y</tt> and <tt>Z</tt> buttons to graph site variables
		<InlineBlockIconify icon="lets-icons:expand-right" size="2rem" />
	</h3>
{/if}

<style>
	h3 :global(.icon) {
		position: relative;
		top: 0.5rem;
	}
</style>
