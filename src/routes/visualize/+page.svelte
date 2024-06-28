<script lang="ts">
	import { recordsToTimeseries } from '$src/appstate/data/datasets.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import StatsDataTable from '$src/components/site/StatsDataTable.svelte';
	import { siteRecords, timeseriesToStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';

	const site = $derived(sites.findById('sjrbc-1'));
	const records = $derived(site && siteRecords(site));
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

<svelte:head>
	<title>Visualize</title>
</svelte:head>

<div>
	<h2>Visualize</h2>

	{#if site}




	<div id="example-stats">
		<h3 class="site-label">Site: {site.name} ({site.id})</h3>
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
				<td>{r.min}</td>
				<td>{r.max}</td>
				<td>{r.mean}</td>
				<td>{r.median}</td>
				<td>{r.stdDev}</td>
				<td class="date">{r.dateFromLabel}</td>
				<td class="date">{r.dateToLabel}</td>
			{/snippet}
		</StatsDataTable>
	</div>

	{/if}
</div>

<style>
	h2 {
		margin-bottom: 1rem;
	}

	#example-stats {
		margin-top: 2rem;
		width: 800px;
		height: 400px;
	}
</style>
