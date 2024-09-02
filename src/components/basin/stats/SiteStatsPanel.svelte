<script lang="ts">
	import type { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { allVariableStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';
	import type { Site } from '$src/lib/types/site';
	import { fmtVarNum, varunits } from '$src/lib/utils/varHelpers';
	import VarValueStandards from '../../tooltips/VarValueStandards.svelte';
	import StatsDataTable from '../../website/StatsDataTable.svelte';
	import TdStatsVariableLabel from './TdStatsVariableLabel.svelte';

	type Props = {
		site: Site;
		dataSelection: DataSelectionState;

		onVarClicked: (name: string) => void;
	};

	const { onVarClicked, dataSelection, site }: Props = $props();

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

		Site:<span style="font-weight: 400">{site.name}</span>
		<span class="subtitle">{site.id}</span>
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
				ySelected={dataSelection.yVar === r.varname &&
					dataSelection.ySite &&
					dataSelection.ySite.id == site.id}
				zSelected={dataSelection.zVar === r.varname &&
					dataSelection.zSite &&
					dataSelection.zSite.id == site.id}
				yHinted={dataSelection.yVar === r.varname}
				zHinted={dataSelection.zVar === r.varname}
				varname={r.varname}
				onclick={() => onVarClicked(r.varname)}
			>
				{r.label}
				{varunits(r.varname, true)}
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

		font-size: 80%;
		display: flex;
		flex-direction: column;
	}

	h3 {
		margin-bottom: 3px;
		margin-top: 0.5rem;

		.subtitle {
			font-size: 0.9rem;
			color: #444;
		}
	}

	#site-stats-panel :global {
		.variable-label:hover {
			cursor: pointer;
			text-decoration: underline;
			text-decoration-thickness: 2px;
			/* text-decoration-style:double; */
		}

		td.date {
			/* font-size: 75%; */
			min-width: 6.2rem;
		}

		td.stat {
			max-width: 3rem;
			overflow-x: hidden;
			padding-right: 0.5rem;
		}
		/* .color-marker {
			display: inline-block;
			position: absolute;

			width: 6px;
			height: 100%;
			background-color: #ab00d6;
			display: none;
		} */

		.selection-hints {
			display: flex;
			height: auto;
			margin-right: 3px;

			pointer-events: none;
			/* border: 1px solid salmon; */

			.y-selection {
				background-color: #ab00d6;
				width: 6px;
				height: 100%;
			}

			.z-selection {
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
