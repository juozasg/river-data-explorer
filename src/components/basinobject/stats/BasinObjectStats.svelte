<script lang="ts">
	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import { chartYSelection, chartZSelection } from "$src/appstate/selection/basinObjectSelection.svelte";
	import StatsDataTable from "$src/components/StatsDataTable.svelte";
	import type { VariableStats } from "$src/lib/types/analysis";
	import { varunits } from "$src/lib/utils/varHelpers";
	import StatsCommonTd from "./StatsCommonTd.svelte";
	import StatsCommonTh from "./StatsCommonTh.svelte";
	import TdStatsVariableLabel from "./TdStatsVariableLabel.svelte";

	type Props = {
		basinObject: BasinObject;
		varLabelClick?: (name: string) => void;
		varGraphButtonClick?: (name: string, axis: "y" | "z", clearGraph: boolean) => void;
	};

	const {
		basinObject,
		varLabelClick = (name: string) => {
			console.log("Variable label clicked:", name);
		},
		varGraphButtonClick = (name: string, axis: "y" | "z", clearGraph: boolean) => {
			console.log("Variable graph button clicked:", name, axis, clearGraph);
			const chartSelection = axis === "y" ? chartYSelection : chartZSelection;
			if (clearGraph) {
				chartSelection.clear();
			} else {
				chartSelection.set(basinObject, name);
				console.log('set chart selection:', chartSelection, axis);
			}
		}
	}: Props = $props();

	const rows: VariableStats[] = $derived(basinObject.allVariableStats);

</script>

<div class="stats-table-container">
	<StatsDataTable data={rows}>
		{#snippet thead()}
			<tr>
				<StatsCommonTh includeLast={basinObject.objectType === 'site'} />
			</tr>
		{/snippet}

		{#snippet row(r: VariableStats)}
			<tr>
				<TdStatsVariableLabel
					ySelected={chartYSelection.basinObject.equals(basinObject) && chartYSelection.varname === r.varname}
					zSelected={chartZSelection.basinObject.equals(basinObject) && chartZSelection.varname === r.varname}
					yHinted={!chartYSelection.basinObject.equals(basinObject) && chartYSelection.varname === r.varname}
					zHinted={!chartZSelection.basinObject.equals(basinObject) && chartZSelection.varname === r.varname}
					varname={r.varname}
					onclick={() => varLabelClick(r.varname)}
					canBeGraphed={r.numObservations > 0}
					{varGraphButtonClick}>
					{r.label}
					{varunits(r.varname, true)}
				</TdStatsVariableLabel>

				{#key r.varname}
					<StatsCommonTd stats={r} includeLast={basinObject.objectType === 'site'} />
				{/key}
			</tr>
		{/snippet}
	</StatsDataTable>
</div>

<style>
	.stats-table-container {
		height: 100%;
		overflow-x: hidden;

		font-size: 90%;
		display: flex;
		flex-direction: column;
	}
</style>
