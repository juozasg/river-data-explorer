<script lang="ts">
  import SelectedSiteHeader from './SelectedSiteHeader.svelte';

	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { allVariableStats } from "$src/lib/data/stats";
	import type { VariableStats } from "$src/lib/types/analysis";
	import type { Site } from "$src/lib/types/site";
	import { fmtVarNum, varunits } from "$src/lib/utils/varHelpers";
	import VarValueStandards from "$src/components/tooltips/VarValueStandards.svelte";
	import StatsDataTable from "$src/components/StatsDataTable.svelte";
	import TdStatsVariableLabel from "./TdStatsVariableLabel.svelte";

	type Props = {
		site: Site;
		dataSelection: DataSelectionState;
		hoverColor?: string;

		varLabelClick: (name: string) => void;
		varGraphButtonClick: (name: string, axis: "y" | "z", clearGraph: boolean) => void;	};

	const { varLabelClick, varGraphButtonClick, dataSelection, site, hoverColor }: Props = $props();

	const table = $derived(site && sitesTables.get(site.id));

	const rows: VariableStats[] = $derived.by(() => {
		if (!table || table.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		return allVariableStats(table);
	});
</script>

<div id="site-stats-panel">
	<SelectedSiteHeader {site} {dataSelection}/>
	<StatsDataTable data={rows}>
		<th>Variable</th>
		<th>Last</th>
		<th>#obs</th>
		<th>Min</th>
		<th>Max</th>
		<th>Mean</th>
		<th>Median</th>
		<th>Sd</th>
		<th>From</th>
		<th>To</th>

		{#snippet row(r: VariableStats)}
			<TdStatsVariableLabel
				ySelected={dataSelection.yVar === r.varname && dataSelection.ySite && dataSelection.ySite.id == site.id}
				zSelected={dataSelection.zVar === r.varname && dataSelection.zSite && dataSelection.zSite.id == site.id}
				yHinted={!!r.varname && dataSelection.yVar === r.varname}
				zHinted={!!r.varname && dataSelection.zVar === r.varname}
				varname={r.varname}
				onclick={() => varLabelClick(r.varname)}
				canBeGraphed={r.numObservations > 0}
				{varGraphButtonClick}>
				<!--  -->
				{r.label}
				{varunits(r.varname, true)}
			</TdStatsVariableLabel>
			{#key r.varname}
				<td><VarValueStandards v={r.varname} value={r.lastObservation} /></td>
				<td>{r.numObservations}</td>
				<td class="stat"><VarValueStandards v={r.varname} value={r.min} /></td>
				<td class="stat"><VarValueStandards v={r.varname} value={r.max} /></td>
				<td class="stat"><VarValueStandards v={r.varname} value={r.mean} /></td>
				<td class="stat"><VarValueStandards v={r.varname} value={r.median} /></td>
				<td class="stat">{fmtVarNum(r.varname, r.stdDev)}</td>
				<td class="date">{r.dateFromLabel}</td>
				<td class="date">{r.dateToLabel}</td>
			{/key}
		{/snippet}
	</StatsDataTable>
</div>

<style>
	#site-stats-panel {
		height: 100%;

		font-size: 90%;
		display: flex;
		flex-direction: column;
	}

	h3 {
		margin-bottom: 6px;
		margin-top: 0.5rem;
		text-align: right;

		.subtitle {
			font-size: 0.9rem;
			font-weight: 300;
			color: #444;
		}
	}

	#site-stats-panel {
		td.date {
			/* font-size: 75%; */
			min-width: 6.2rem;
		}

		td.stat {
			max-width: 3rem;
			overflow-x: hidden;
			padding-right: 0.5rem;
		}

		.selection-hints {
			height: 20px;
			display: inline-block;
			position: relative;
			bottom: -3px;

			pointer-events: none;

			.y-selection {
				display: inline-block;
				background-color: #ab00d6;
				width: 6px;
				height: 100%;
			}

			.z-selection {
				display: inline-block;

				background-color: #00d6ab;
				width: 6px;
				height: 100%;
			}
		}
		th {
			position: sticky;
			top: 0;
			background-color: white;
			border-bottom: 1px solid #555 !important;
			border-collapse: separate !important;
		}
	}
</style>
