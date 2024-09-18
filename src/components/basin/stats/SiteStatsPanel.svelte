<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { allVariableStats } from "$src/lib/data/stats";
	import type { VariableStats } from "$src/lib/types/analysis";
	import type { Site } from "$src/lib/types/site";
	import { fmtVarNum, varunits } from "$src/lib/utils/varHelpers";
	import VarValueStandards from "$src/components/tooltips/VarValueStandards.svelte";
	import StatsDataTable from "$src/components/StatsDataTable.svelte";
	import TdStatsVariableLabel from "./TdStatsVariableLabel.svelte";
	import { on } from "events";

	type Props = {
		site: Site;
		dataSelection: DataSelectionState;
		hoverColor?: string;

		onVarClicked: (name: string, axis?: "y" | "z") => void;
	};

	const { onVarClicked, dataSelection, site, hoverColor }: Props = $props();

	const table = $derived(site && sitesTables.get(site.id));

	const rows: VariableStats[] = $derived.by(() => {
		if (!table || table.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		return allVariableStats(table);
	});
</script>

<div id="site-stats-panel">
	<h3 class="site-label">
		<div class="selection-hints">
			{#if dataSelection.ySite && dataSelection.ySite.id == site.id}
				<div class="y-selection"></div>
			{/if}
			{#if dataSelection.zSite && dataSelection.zSite.id == site.id}
				<div class="z-selection"></div>
			{/if}
		</div>

		<span class="pill">site</span>
		<span class="label">
			<span style="font-weight: 400">{site.name}</span>
			<span class="subtitle">{site.id}</span>
		</span>
	</h3>
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
				onclick={() => onVarClicked(r.varname)}>
				<!-- {hoverColor} -->
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

			<td><VarValueStandards v={r.varname} value={r.lastObservation} /></td>
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
	#site-stats-panel {
		height: 100%;

		font-size: 90%;
		display: flex;
		flex-direction: column;
	}

	.graph-buttons {
		display: none;

		white-space: nowrap;
		position: absolute;
		right: 0;
		top: -4px;
		/* text-align: right; */

		.graph-button.y {
			border: 2px solid var(--color-chart-y);

			&:hover {
				background-color: var(--color-chart-y);
				color: white;
				text-decoration: none;
			}
		}

		.graph-button.z {
			border: 2px solid var(--color-chart-z);
			&:hover {
				background-color: var(--color-chart-z);
				color: white;
				text-decoration: none;
			}
		}
	}

	:global(table tr:hover .graph-buttons) {
		display: block;
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
