<script lang="ts">
	import * as aq from "arquero";

	import TdStatsVariableLabel from "./TdStatsVariableLabel.svelte";

	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { regionEqual, type RegionFeature } from "$src/appstate/data/features.svelte";
	import { Sites, sites } from "$src/appstate/sites.svelte";
	import { allVariableStats, allVarsDailyMedians, sitesDataStats } from "$src/lib/data/stats";
	import { concatTablesAllColumns } from "$src/lib/data/tableHelpers";
	import type { VariableStats } from "$src/lib/types/analysis";
	import { fmtVarNum, varunits } from "$src/lib/utils/varHelpers";
	import type ColumnTable from "arquero/dist/types/table/column-table";
	import VarValueStandards from "$src/components/tooltips/VarValueStandards.svelte";
	import StatsDataTable from "$src/components/StatsDataTable.svelte";
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { bm } from "$src/lib/utils";

	type Props = {
		region: RegionFeature;
		dataSelection: DataSelectionState;

		onVarClicked: (name: string, axis?: "y" | "z") => void;
	};

	let { onVarClicked, region, dataSelection }: Props = $props();

	// const sitesInRegion = $derived(sites.allEnabled.filter((s) => s.huc10 === region?.id));
	const sitesInRegion = $derived(Sites.forRegionFeature(sites.allEnabled, region));

	const sitesStats = $derived(sitesDataStats(sitesInRegion));
	const sitesInAreaTables = $derived(sitesInRegion.map((s) => sitesTables.get(s.id)).filter((t) => t)) as ColumnTable[];

	const rows: VariableStats[] = $derived.by(() => {
		// dont bother with empty tables
		const dailyMedians = allVarsDailyMedians(sitesInAreaTables);
		console.log("daily meads", dailyMedians.objects());

		return allVariableStats(dailyMedians, {
			errorLabel: sitesInRegion.map((s) => s.id).join(", ")
		});
	});
</script>

<div id="region-stats-panel">
	<div class="flex stats-summary">
		<div class="cell"><p><b>{sitesStats.numSites}</b> sites</p></div>
		<div class="cell"><p><b>{sitesStats.numVariables}</b> variables</p></div>
		<div class="cell"><p><b>{sitesStats.numRecords}</b> records</p></div>
		{#if sitesStats.dateFromLabel && sitesStats.dateToLabel}
			<div class="cell">
				<span class="timespan">
					from <b>{sitesStats.dateFromLabel}</b> to <b>{sitesStats.dateToLabel}</b>
				</span>
			</div>
		{/if}
	</div>

	<StatsDataTable data={rows}>
		<th>Variable</th>
		<th>#obs</th>
		<th>Min</th>
		<th>Max</th>
		<th>Mean</th>
		<th>Med</th>
		<th>Sd</th>
		<th>From</th>
		<th>To</th>

		{#snippet row(r: VariableStats)}
			<TdStatsVariableLabel
				ySelected={dataSelection.yVar === r.varname &&
					dataSelection.yRegion &&
					regionEqual(dataSelection.yRegion, region)}
				zSelected={dataSelection.zVar === r.varname &&
					dataSelection.zRegion &&
					regionEqual(dataSelection.zRegion, region)}
				yHinted={!!r.varname && dataSelection.yVar === r.varname}
				zHinted={!!r.varname && dataSelection.zVar === r.varname}
				varname={r.varname}
				onclick={() => onVarClicked(r.varname)}>
				{r.label}
				{varunits(r.varname, true)}
				<div class="graph-buttons">
					<a
						class="graph-button y"
						onclick={(e) => {
							onVarClicked(r.varname, "y");
							e.stopPropagation();
						}}>Y</a>
					<a
						class="graph-button z"
						onclick={(e) => {
							onVarClicked(r.varname, "z");
							e.stopPropagation();
						}}>Z</a>
				</div>
			</TdStatsVariableLabel>

			<td>{r.numObservations}</td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.min} /></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.max} /></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.mean} /></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.median} /></td>
			<td class="stat">{fmtVarNum(r.varname, r.stdDev)}</td>
			<td class="date">{r.dateFromLabel}</td>
			<td class="date">{r.dateToLabel}</td>
		{/snippet}
	</StatsDataTable>
</div>

<style>
	#region-stats-panel {
		height: 100%;

		font-size: 90%;
		display: flex;
		flex-direction: column;
	}

	#region-stats-panel :global {
		td.date {
			min-width: 6.2rem;
		}
	}

	:global(table tr:hover .graph-buttons) {
		display: block;
	}

	.graph-buttons {
		/* position: relative; */
		top: -3px;
		/* bottom: -3px; */
	}

	p {
		margin-bottom: 0.2rem !important;
	}

	.stats-summary {
		color: #777;
		margin-bottom: 0 !important;
		font-size: 0.9rem !important;
	}

	.flex {
		font-size: 1rem;
		display: flex;
		flex-wrap: wrap;
		column-gap: 2rem;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		/* padding-right: 1rem; */
	}
</style>
