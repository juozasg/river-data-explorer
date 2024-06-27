<script lang="ts">
	import { datasets } from '$src/appstate/data/datasets.svelte';
	import { selectedSite, selectedArea } from '$src/appstate/map/featureState.svelte';
	import { sites as sitesState } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { mdiDetails } from '@mdi/js';

	const area = $derived(selectedArea);
	const sites = $derived(sitesState.selected);
	let varsNumber = $state(0);
	let recordsNumber = $state(0);

	// const firstObservations: Record<string, Date> = $state({});
	// const lastObservations: Record<string, Date> = $state({});

	let firstObs: Date | undefined = $state();
	let lastObs: Date | undefined = $state();

	$effect(() => {
		let _varsNumber = 0;
		let _recordsNumber = 0;

		for (const s of sites) {
			const records = datasets.get(s.id);
			_recordsNumber += records?.length || 0;

			const firstRecord = records?.[0] || {};
			_varsNumber = Math.max(_varsNumber, Object.keys(firstRecord).length);

			const lastRecord = records?.[records.length - 1] || {};

			const firstDate = firstRecord.date;
			const lastDate = firstRecord.date;

			if (firstDate) {
				if (!firstObs) firstObs = firstDate;

				if (firstDate < firstObs!) {
					firstObs = firstDate;
				}
			}

			if (lastDate) {
				if (!lastObs) lastObs = lastDate;

				if (lastDate > lastObs!) {
					lastObs = lastDate;
				}
			}
		}

		varsNumber = _varsNumber > 0 ? _varsNumber - 1 : 0; // remove 'date' column
		recordsNumber = _recordsNumber;
	});

	const shortMon = (date: Date): string => date.toLocaleString('default', { month: 'short' });
	// const short = (date: Date): string => date.toLocaleString('default', { month: 'short' });
	const fmtDate = (date: Date): string => `${shortMon(date)} ${date.getDay()}, ${date.getFullYear()}`
</script>

{#snippet thead()}
<thead>
	<tr>
		<th>Variable</th>
		<th>Last</th>
		<th>From</th>
		<th>To</th>
		<th># obs</th>
		<th>Min</th>
		<th>Max</th>
		<th>Mean</th>
		<th>Median</th>
		<th>Std Dev</th>
	</tr>
</thead>
{/snippet}


{#snippet phosphate()}
<tr>
	<td>Phosphate</td>
	<td>78</td>
	<td>2009-01-01</td>
	<td>2020-09-31</td>
	<td>53</td>
	<td>0.2</td>
	<td>101.6</td>
	<td>60.0</td>
	<td>60.0</td>
	<td>15.2</td>
</tr>
{/snippet}



{#snippet tbody()}
<tbody>


	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}

	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}
	{@render phosphate()}


</tbody>
{/snippet}

<div id="panel">
	{#if selectedSite.site}
	<h3 class='site-label'>Site: {selectedSite.site?.name} ({selectedSite.site?.id})</h3>
	<div class="table-container">
		<table class="table is-striped is-narrow">
			{@render thead()}
			{@render tbody()}
		</table>
	</div>
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


	table {
		border-collapse: separate;
	}

	tr td:nth-child(2), tr th:nth-child(2) {
		border-right: 1px dashed #ccc;
	}
	tr td:first-child {
		font-weight: 500;
	}

	.table-container {
		/* height: 300px; */
		height: 100%;
		overflow-y: auto;
		/* margin-bottom: 3rem; */
	}


</style>
