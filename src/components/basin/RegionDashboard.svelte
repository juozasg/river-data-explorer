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

<p><b>{sites.length}</b> sites</p>
<p><b>{varsNumber}</b> variables</p>
<p><b>{recordsNumber}</b> observations
	{#if firstObs && lastObs}
	<span class='timespan'>
	 from <b>{fmtDate(firstObs)}</b> to <b>{fmtDate(lastObs)}</b>
	</span>
	{/if}
</p>

{#snippet thead()}
<thead>
	<tr>
		<th>Variable</th>
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



{#snippet tbody()}
<tbody>
	<tr>
		<td>Temperature</td>
		<td>2009-01-01</td>
		<td>2020-09-31</td>
		<td>53</td>
		<td>0.2</td>
		<td>101.6</td>
		<td>60.0</td>
		<td>60.0</td>
		<td>15.2</td>
	</tr>
	<tr>
		<td>ph</td>
		<td>2009-01-01</td>
		<td>2020-09-31</td>
		<td>53</td>
		<td>0.2</td>
		<td>101.6</td>
		<td>60.0</td>
		<td>60.0</td>
		<td>15.2</td>
	</tr>
	<tr>
		<td>Dissolved Oxygen</td>
		<td>2009-01-01</td>
		<td>2020-09-31</td>
		<td>53</td>
		<td>0.2</td>
		<td>101.6</td>
		<td>60.0</td>
		<td>60.0</td>
		<td>15.2</td>
	</tr>
	<tr>
		<td>Phosphate</td>
		<td>2009-01-01</td>
		<td>2020-09-31</td>
		<td>53</td>
		<td>0.2</td>
		<td>101.6</td>
		<td>60.0</td>
		<td>60.0</td>
		<td>15.2</td>
	</tr>
</tbody>
{/snippet}

<div class="details">

<table class="table">
	{@render thead()}
	{@render tbody()}
</table>


{#if selectedSite.site}
	<h5>Site: {selectedSite.site?.name} ({selectedSite.site?.id})</h5>
	<table class="table">
		{@render thead()}
		{@render tbody()}
	</table>
{:else}
	<h5>Click a site marker on the map to select</h5>
{/if}

</div>

<style>
	.details {
		height: 600px;
	}
	p {
		margin-bottom: 0.2rem !important;
	}

	.timespan {
		b {
			/* font-weight: 600; */
			font-size: 90%
		}
	}
</style>
