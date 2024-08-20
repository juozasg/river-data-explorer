<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';
	import { allVariableStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';
	import { fmtVarNum, varunits } from '$src/lib/utils';
	import StatsDataTable from '../website/StatsDataTable.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { tooltipText } from '$src/lib/data/tableHelpers';
	import HoveredVariableTooltip from '../website/HoveredVariableTooltip.svelte';

	const table = $derived(selectedSite.site && sitesTables.get(selectedSite.site.id));

	const rows: VariableStats[] = $derived.by(() => {
		if (!table || table.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		return allVariableStats(table);
	});

	let variableTooltip: HoveredVariableTooltip | undefined = $state();

</script>

<HoveredVariableTooltip bind:this={variableTooltip} />

<div id="panel">
	{#if selectedSite.site}
		<h3 class="site-label">
			Site: {selectedSite.site?.name} ({selectedSite.site?.id})
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
				<td
					onmouseleave={(e: MouseEvent) => variableTooltip?.mouseLeaveVariable(e)}
					onmousemove={(e: MouseEvent) => variableTooltip?.mouseMoveVariable(e, r.variable)}
					>{r.label} {varunits(r.variable)}
				</td>
				<td>{fmtVarNum(r.variable, r.lastObservation)}</td>
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
	{:else}
		<h2>Click a site marker on the map to select</h2>
	{/if}
</div>

<style>
	#panel {
		height: 100%;

		font-size: 80%;
		display: flex;
		flex-direction: column;
	}

	h3 {
		margin-bottom: 3px;
		margin-top: 0.5rem;
	}

	td.date {
		/* font-size: 75%; */
		min-width: 6rem;
	}

	td.stat {
		max-width: 3rem;
		overflow-x: hidden;
		padding-right: 0.5rem;
	}

	th {
		position: sticky;
		top: 0;
		background-color: white;
		border-bottom: 1px solid #555 !important;
		border-collapse: separate !important;
	}
</style>
