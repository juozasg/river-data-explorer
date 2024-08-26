<script lang="ts">
	import * as d3sc from 'd3-scale-chromatic';
	import * as d3i from 'd3-interpolate';
	import * as d3s from 'd3-scale';
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import { interpolateVarColor } from '$src/lib/utils/colors';
	import { allVariableStats, variableStats } from '$src/lib/data/stats';
	import { concatTablesAllColumns } from '$src/lib/data/tableHelpers';
	import { sitesTables } from '$src/appstate/data/datasets.svelte';

	let value = $state(0.5);
	const color = $derived(d3sc.interpolatePlasma(value));

	let varname = $state('temp');

	const getColor = () => interpolateVarColor(varname, value);

	const min = $derived(variablesMetadata[varname]?.scale?.min || 0);
	const max = $derived(variablesMetadata[varname]?.scale?.max || 10);

	$effect(() => {
		const combinedTable = concatTablesAllColumns([...sitesTables.values()]);
		const orderedTable = combinedTable.orderby('date').reify();
		console.log('all stats', allVariableStats(orderedTable, { errorLabel: '' }));


		// if (combinedTable.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		// return allVariableStats(orderedTable, { errorLabel: '' });
	});
</script>

<select bind:value={varname} style="margin-bottom: 2rem">
	{#each Object.keys(variablesMetadata) as vname}
		<option>{vname}</option>
	{/each}
</select>

<input type="range" bind:value {min} {max} step={(max - min) / 1000} style="width:600px" />
<pre>
	min = {min}
	max = {max}
	interpid = {variablesMetadata[varname]?.scale?.d3}
	{varname} = {value}
</pre>
<i>{color}</i>

<div id="panel" style="--color: {getColor()}"></div>

<style>
	#panel {
		display: block;
		border: 2px solid plum;
		width: 150px;
		height: 50px;
		background-color: var(--color);
	}
</style>
