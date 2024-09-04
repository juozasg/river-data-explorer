<script lang="ts">


	import type { Site } from '$lib/types/site';
	import { sites, Sites } from '$src/appstate/sites.svelte';
	import { aremove } from '$src/lib/utils';
	import { chartYColor, chartZDarker } from '$src/lib/utils/chart';

		let dataset: string = $state('steuben');
	let datasetNum: number = $state(8);

	$effect(() => {
		tableName = `${dataset}-${datasetNum}`;
		// console.log(tableName)
	});

	// let yVar: string = $state('bod');
	// let zVar: string = $state('bodPercent');

	// const { table, yParams, zParams }: {table: ColumnTable, yParams: YZChartParams, zParams: YZChartParams}  = $props()
	let { table,
		yVar = $bindable('bod'),
		zVar = $bindable('bodPercent'),
		tableName = $bindable(),
			// datasetNum = $bindable(1),
	 }: any  = $props()



	const availableVars = $derived(aremove(table?.columnNames(), 'invertNarrative', 'date') || []);
	const availableDatasetSites = $derived(Sites.groupedBy(sites.withDataTables(), 'dataset'));
	const availableDatasetNames = $derived([...availableDatasetSites.keys()]);
	const availableTableNums = $derived(
		availableDatasetSites.get(dataset)?.map((s: Site) => s.num) || []
	);

	$effect(() => {
		if (!availableVars.length) return;
		if (!availableVars.includes(yVar)) yVar = availableVars[0];
		if (!availableVars.includes(zVar)) zVar = availableVars[1] || availableVars[0];
		if (!availableTableNums.includes(datasetNum)) datasetNum = availableTableNums[0];
	});
</script>



<h4>Dataset: {dataset} Num: {datasetNum}</h4>
<div style="display: flex">
	<select bind:value={dataset} style="margin-right: 1rem;">
		{#each availableDatasetNames as name}
			<option value={name}>{name}</option>
		{/each}
	</select>
	<select bind:value={datasetNum}>
		{#each availableTableNums as num}
			<option value={num}>{num}</option>
		{/each}
	</select>
</div>

<div style="display: flex">
	<h4 style="color: {chartYColor}">Y var: {yVar}</h4>
	<select bind:value={yVar} style="margin-right: 2rem; margin-left: 1rem;">
		{#each availableVars as varname}
			<option value={varname}>{varname}</option>
		{/each}
	</select>

	<h4 style="color: {chartZDarker}">Z var: {zVar}</h4>
	<select bind:value={zVar} style="margin-left: 1rem;">
		{#each availableVars as varname}
			<option value={varname}>{varname}</option>
		{/each}
	</select>
</div>

<style>
	h4 {
		margin-bottom: 2px;
	}

	select {
		margin-bottom: 1rem;
		font-size: 110%;
	}
</style>