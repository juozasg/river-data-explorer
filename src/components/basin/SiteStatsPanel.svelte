<script lang="ts">
	import { datasets } from '$src/appstate/data/datasets.svelte';
	import { selectedSite, selectedArea } from '$src/appstate/map/featureState.svelte';
	import StatsDataTable from '../site/StatsDataTable.svelte';

	const rows: any[] = [];
	const r = {
		label: 'Temperature',
		lastObservation: 79.2,
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

		{#snippet row(d)}
			<td>Temperature</td>
			<td>79.2</td>
			<td>53</td>
			<td>0.2</td>
			<td>101.6</td>
			<td>60.0</td>
			<td>60.0</td>
			<td>15.2</td>
			<td class="date">2009-01-01</td>
			<td class="date">2020-09-31</td>
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

	th {
		position: sticky;
		top: 0;
		background-color: white;
		border-bottom: 1px solid #555 !important;
		border-collapse: separate !important;
	}

</style>
