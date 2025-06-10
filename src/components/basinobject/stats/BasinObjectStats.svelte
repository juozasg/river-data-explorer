<script lang="ts">
	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import StatsDataTable from "$src/components/StatsDataTable.svelte";
	import VarValueStandards from "$src/components/tooltips/VarValueStandards.svelte";
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
		}
	}: Props = $props();

	const rows: VariableStats[] = $derived(basinObject.allVariableStats.concat(basinObject.allVariableStats));
</script>

<div class="stats-table-container">
	<StatsDataTable data={rows}>
		{#snippet thead()}
			<tr>
				<StatsCommonTh includeLast={true} />
			</tr>
		{/snippet}

		{#snippet row(r: VariableStats)}
			<tr>
				<TdStatsVariableLabel
					ySelected={false}
					zSelected={false}
					yHinted={false}
					zHinted={false}
					varname={r.varname}
					onclick={() => varLabelClick(r.varname)}
					canBeGraphed={r.numObservations > 0}
					{varGraphButtonClick}>
					{r.label}
					{varunits(r.varname, true)}
				</TdStatsVariableLabel>

				{#key r.varname}
					<td>
						<VarValueStandards v={r.varname} value={r.lastObservation} />
					</td>
					<StatsCommonTd stats={r} />
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
