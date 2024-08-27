<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import StatsDataTable from '$src/components/website/StatsDataTable.svelte';
	import { variableStats } from '$src/lib/data/stats.js';
	import type { VariableStats } from '$src/lib/types/analysis';
		import { fmtVarNum } from '$src/lib/utils/varHelpers';

	const site = $derived(sites.findById('sjrbc-1'));
	const table = $derived(site && sitesTables.get(site.id));

	const rows: VariableStats[] = $derived.by(() => {
		const rs: VariableStats[] = [];
		if(table) {
			for(const variable of table.columnNames()) {
				if(variable === 'date') continue;
				const vs = variableStats(variable, table, {errorLabel: variable});
				rs.push(vs);
			}
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
				<td>{fmtVarNum(r.varname, r.lastObservation)}</td>
				<td>{r.numObservations}</td>
				<td>{fmtVarNum(r.varname, r.min)}</td>
				<td>{fmtVarNum(r.varname, r.max)}</td>
				<td>{fmtVarNum(r.varname, r.mean)}</td>
				<td>{fmtVarNum(r.varname, r.median)}</td>
				<td>{fmtVarNum(r.varname, r.stdDev)}</td>
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
