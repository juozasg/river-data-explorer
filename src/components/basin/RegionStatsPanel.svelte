<script lang="ts">
	import { datasets } from '$src/appstate/data/datasets.svelte';
	import { selectedSite, selectedArea } from '$src/appstate/map/featureState.svelte';
	import { sites as appstateSites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { mdiDetails } from '@mdi/js';
	import StatsDataTable from '../site/StatsDataTable.svelte';
	import type { VariableStats } from '$src/lib/types/analysis';

	const area = $derived(selectedArea);
	const sites = $derived(appstateSites.all.filter((s) => s.huc10 === area.id));
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
	const fmtDate = (date: Date): string =>
		`${shortMon(date)} ${date.getDay()}, ${date.getFullYear()}`;

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
		<div class="cell"><p><b>{sites.length}</b> sites</p></div>
		<div class="cell"><p><b>{varsNumber}</b> variables</p></div>
		<div class="cell"><p><b>{recordsNumber}</b> observations</p></div>
		{#if firstObs && lastObs}
			<div class="cell">
				<span class="timespan">
					from <b>{fmtDate(firstObs)}</b> to <b>{fmtDate(lastObs)}</b>
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
