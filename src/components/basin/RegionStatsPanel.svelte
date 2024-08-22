<script lang="ts">
	import Icon from '@iconify/svelte';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { selectedRegion } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { allVariableStats, sitesDataStats, variableStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';
	import { fmtVarNum, varunits } from '$src/lib/utils';
	import StatsDataTable from '../website/StatsDataTable.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { concatTablesAllColumns } from '$src/lib/data/tableHelpers';
	import HoveredVariableTooltip from '../website/HoveredVariableTooltip.svelte';

	const region = $derived(selectedRegion);
	const sitesInArea = $derived(sites.allEnabled.filter((s) => s.huc10 === region.id));

	const sitesStats = $derived(sitesDataStats(sitesInArea));
	const sitesInAreaTables = $derived(
		sitesInArea.map((s) => sitesTables.get(s.id)).filter((t) => t)
	) as ColumnTable[];

	const rows: VariableStats[] = $derived.by(() => {
		const combinedTable = concatTablesAllColumns(sitesInAreaTables);

		if (combinedTable.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		const orderedTable = combinedTable.orderby('date').reify();
		return allVariableStats(orderedTable, { errorLabel: sitesInArea.map((s) => s.id).join(', ') });
	});

	let variableTooltip: HoveredVariableTooltip | undefined = $state();
</script>

<HoveredVariableTooltip bind:this={variableTooltip} />

<div id="region-stats-panel">
	{#if region.feature}
		<h3>
			Region: {region.name} <span class="subtitle">HUC10:{region.id}</span>
		</h3>
	{/if}
	<div class="flex">
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
			<td
				onmouseleave={(e: MouseEvent) => variableTooltip?.mouseLeaveVariable(e)}
				onmousemove={(e: MouseEvent) => variableTooltip?.mouseMoveVariable(e, r.variable)}
				>{r.label} {varunits(r.variable)}
			</td>
			<td>{r.numObservations}</td>
			<td class="stat">{fmtVarNum(r.variable, r.min)}</td>
			<td class="stat">{fmtVarNum(r.variable, r.max)}</td>
			<td class="stat">{fmtVarNum(r.variable, r.mean)}</td>
			<td class="stat">{fmtVarNum(r.variable, r.median)}</td>
			<td class="stat">{fmtVarNum(r.variable, r.stdDev)}</td>
			<td class="date">{r.dateFromLabel}</td>
			<td class="date">{r.dateToLabel}</td>
		{/snippet}
	</StatsDataTable>
</div>

<style>
	#region-stats-panel {
		height: 100%;

		font-size: 80%;
		display: flex;
		flex-direction: column;
	}

	p {
		margin-bottom: 0.2rem !important;
	}

	h3 {
		margin-bottom: 3px;
		/* margin-top: 0.5rem; */

		.subtitle {
			font-size: 0.9rem;
			color: #444;
		}
	}

	h3 :global(.icon) {
		height: 24px;
		vertical-align: -6px !important;
	}

	h3 :global(.blink) {
		animation: blink 1s linear 2;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
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
