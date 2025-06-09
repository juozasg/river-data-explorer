<script lang="ts">
	import SelectedSiteHeader from './SelectedSiteHeader.svelte';

	import type { ChartDataSelectionState } from "$src/appstate/selection/chartDataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { allVariableStats } from "$src/lib/data/stats";
	import type { VariableStats } from "$src/lib/types/analysis";
	import type { Site } from "$src/lib/types/site";
	import { fmtVarNum, varunits } from "$src/lib/utils/varHelpers";
	import VarValueStandards from "$src/components/tooltips/VarValueStandards.svelte";
	import StatsDataTable from "$src/components/StatsDataTable.svelte";
	import TdStatsVariableLabel from "./TdStatsVariableLabel.svelte";
	import StatsCommonTh from './StatsCommonTh.svelte';
	import StatsCommonTd from './StatsCommonTd.svelte';

	type Props = {
		site: Site;
		dataSelection: ChartDataSelectionState;
		hoverColor?: string;

		varLabelClick: (name: string) => void;
		varGraphButtonClick: (name: string, axis: "y" | "z", clearGraph: boolean) => void;	};

		const { varLabelClick, varGraphButtonClick, dataSelection, site, hoverColor }: Props = $props();

		const table = $derived(site && sitesTables.get(site.siteId));

		const rows: VariableStats[] = $derived.by(() => {
			if (!table || table.numRows() == 0) return [];
			// dont order empty tables because column date won't exist
			return allVariableStats(table);
		});
	</script>

	<div class="stats-table-container">
		<StatsDataTable data={rows}>

			{#snippet thead()}
				<tr>
					<StatsCommonTh includeLast={true}/>
				</tr>
			{/snippet}

			{#snippet row(r: VariableStats)}
				<tr>
					<TdStatsVariableLabel
					ySelected={dataSelection.yVar === r.varname && dataSelection.ySite && dataSelection.ySite.siteId == site.siteId}
					zSelected={dataSelection.zVar === r.varname && dataSelection.zSite && dataSelection.zSite.siteId == site.siteId}
					yHinted={!!r.varname && dataSelection.yVar === r.varname}
					zHinted={!!r.varname && dataSelection.zVar === r.varname}
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
						<StatsCommonTd stats={r}/>
					{/key}
				</tr>
			{/snippet}
	</StatsDataTable>
</div>

<style>
	.stats-table-container {
		height: 100%;

		font-size: 90%;
		display: flex;
		flex-direction: column;
	}





</style>
