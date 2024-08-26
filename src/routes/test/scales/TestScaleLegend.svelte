<script lang="ts">
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import LegendColorBar from '$src/components/maps/controls/Legend.svelte';
	import { interpolateVarColor, interpolateVarDataURL } from '$src/lib/utils/colors';
	import * as d3sc from 'd3-scale-chromatic';
	import { onMount } from 'svelte';

	let value = $state(400);
	const color = $derived(d3sc.interpolatePlasma(value));

	let varname = $state('temp');

	const getColor = () => interpolateVarColor(varname, value);


	let doc: Document | undefined = $state();

	onMount(() => {
		doc = document;
	});


	const min = 400;
	const max = 800;

	const dataUrl = $derived(doc && interpolateVarDataURL(doc, varname));
</script>
<input type="range" bind:value {min} {max} step={(max - min) / 1000} style="width:600px" />

<div id="panel" style="width: {value}px">
	<select bind:value={varname} style="margin-bottom: 2rem">
		{#each Object.keys(variablesMetadata) as vname}
			<option>{vname}</option>
		{/each}
	</select>

	<pre>
	min = {min}
	max = {max}
	interpid = {variablesMetadata[varname]?.scale?.d3}
	{varname} = {value}
</pre>
	<i>{color}</i>

	<LegendColorBar {varname} />
	<!-- <LegendColorBar  {varname} /> -->
</div>

<style>
	#panel {
		position: relative;
		margin: 2rem;
		padding: 1rem;
		/* width: 700px; */
		height: 600px;
		border: 1px solid olivedrab;
	}
</style>
