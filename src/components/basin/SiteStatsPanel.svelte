<script lang="ts">
	import { selectedSite } from '$src/appstate/map/featureState.svelte';
	import type { VariableStats } from '$src/lib/types/analysis';
	import StatsDataTable from '../site/StatsDataTable.svelte';

	// const rows: any[] = [];
	// const r: VariableStats = {
	// 	variable: 'temp',
	// 	label: 'Temperature',
	// 	lastObservation: 79.2,
	// 	numObservations: 54,
	// 	min: 0.2,
	// 	max: 101.6,
	// 	mean: 60.0,
	// 	median: 62.0,
	// 	stdDev: 15.2,
	// 	dateFromLabel: '2009-01-01',
	// 	dateToLabel: '2020-09-31',
	// }

	const records = $derived(selectedSite.site && siteRecords(selectedSite.site));
	const siteTimeseries = $derived(records && recordsToTimeseries(records));
	const rows: VariableStats[] = $derived.by(() => {
		const rs: VariableStats[] = [];
		console.log(siteTimeseries)
		for (const variable in siteTimeseries) {
			const ts = siteTimeseries[variable];
			const stats = timeseriesToStats(variable, ts);
			rs.push(stats);
		}
		return rs;
	});


</script>



<div id="panel">
	{#if selectedSite.site}
	<h3 class='site-label'>Site: {selectedSite.site?.name} ({selectedSite.site?.id})</h3>
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
			<td>{r.label}</td>
			<td>{r.lastObservation}</td>
			<td>{r.numObservations}</td>
			<td class="stat">{r.min}</td>
			<td class="stat">{r.max}</td>
			<td class="stat">{r.mean}</td>
			<td class="stat">{r.median}</td>
			<td class="stat">{r.stdDev}</td>
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
