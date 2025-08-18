<script lang="ts">
	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import { triggerHackyGlobalVardateSync, varstate } from "$src/appstate/map/mapvarstate.svelte";
	import { chartYSelection, chartZSelection } from "$src/appstate/selection/objectDataSelections.svelte";
	import { joinYZTable } from "$src/lib/utils/chart";
	import { varChartDomain, YZChartParams } from "$src/lib/utils/YZChartParams";
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";
	import { vars } from "../test-pages/fixtures";
	import BrushedYzChart from "./BrushedYZChart.svelte";

	type Props = {
		width: number;
		height: number;
	};

	const { width, height }: Props = $props();

	const onDateSelect = (date: Date) => {
		// varstate.vardate = new Date(date);
		triggerHackyGlobalVardateSync(date);
	};


	const yTable = $derived(chartYSelection.table());
	const zTable = $derived(chartZSelection.table());


	const yzTable = $derived.by(() => {
		yTable?.objects();
		zTable?.objects();
		return joinYZTable(yTable, zTable);
	});

	const yDomain = $derived(varChartDomain("y", chartYSelection.varname, yzTable));
	const zDomain = $derived(varChartDomain("z", chartZSelection.varname, yzTable));

	const forceDomain: [number, number] | undefined = $derived.by(() => {
		if (chartYSelection.varname == chartZSelection.varname) {
			const minDomain = Math.min(yDomain[0], zDomain[0]);
			const maxDomain = Math.max(yDomain[1], zDomain[1]);

			return [minDomain, maxDomain];
		}
		return;
	});

	function locationName(basinObject?: BasinObject): string {
		if(!basinObject) return "";
		let name = basinObject.objectLabelName;

		name = name + ' ' + basinObject.objectTypeLabel;

		if(basinObject.objectSiteId) {
			name += ` (${basinObject.objectSiteId.replace(/-/, "&#8209;")})`; // non-breaking hyphen
		}



		return name;
	}

	let yParams = $derived(
		new YZChartParams(
			"y",
			chartYSelection.varname || "",
			yzTable,
			locationName(chartYSelection.basinObject),
			forceDomain ?? yDomain
		)
	);
	let zParams = $derived(
		new YZChartParams(
			"z",
			chartZSelection.varname || "",
			yzTable,
			locationName(chartZSelection.basinObject),
			forceDomain ?? zDomain
		)
	);

	$effect(() => {
		// console.log("yParams", yParams);
		// console.log("zParams", zParams);
		// console.log('yTable', yTable?.objects());
		// console.log('zTable', zTable?.objects());

		// console.log("yzTable", yzTable?.objects());
	});
</script>

{#if yzTable && yParams && zParams}
	<BrushedYzChart {yzTable} {yParams} {zParams} {onDateSelect} {width} {height}/>
{:else}
	<!-- <h3>
		<InlineBlockIconify icon="lets-icons:expand-up" size="2rem" />
		Click site markers to select sites

	</h3> -->

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
			opacity: 1 !important;
		}
	}

</style>
