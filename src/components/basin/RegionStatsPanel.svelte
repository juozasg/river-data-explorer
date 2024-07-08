<script lang="ts">
	import { selectedArea } from '$src/appstate/map/featureState.svelte';
	import { sites as appstateSites } from '$src/appstate/sites.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';
	import StatsDataTable from '../site/StatsDataTable.svelte';

	const area = $derived(selectedArea);
	const sites = $derived(appstateSites.all.filter((s) => s.huc10 === area.id));
	let varsNumber = $state(0);
	let recordsNumber = $state(0);

	// const firstObservations: Record<string, Date> = $state({});
	// const lastObservations: Record<string, Date> = $state({});

	let firstObs: Date | undefined = $state();
	let lastObs: Date | undefined = $state();

	const sitesStats = $derived(sitesDataStats(sites));


	// const combinedTimeseries = (sites) => {
	// 	const
	// }

	// const records = $derived( && siteRecords(selectedSite.site));
	// const siteTimeseries = $derived(records && recordsToTimeseries(records));
	// const rows: VariableStats[] = $derived.by(() => {
	// 	const rs: VariableStats[] = [];
	// 	console.log(siteTimeseries)
	// 	for (const variable in siteTimeseries) {
	// 		const ts = siteTimeseries[variable];
	// 		const stats = timeseriesToStats(variable, ts);
	// 		rs.push(stats);
	// 	}
	// 	return rs;
	// });



	const rows: any[] = [];
	const r: VariableStats = {
		label: 'Temperature',
		numObservations: 54,
		min: 0.2,
		max: 101.6,
		mean: 60.0,
		median: 62.0,
		stdDev: 15.2,
		dateFromLabel: '2009-01-01',
		dateToLabel: '2020-09-31',
	}

	for (let i = 0; i < 20; i++) {
		rows.push(r);
	}
</script>

<div id="panel">
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

		{#snippet row(d: VariableStats)}
		<td>{r.label}</td>
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

<style>
	#panel {
		height: 100%;

		font-size: 80%;
		display: flex;
		flex-direction: column;
	}

	p {
		margin-bottom: 0.2rem !important;
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
