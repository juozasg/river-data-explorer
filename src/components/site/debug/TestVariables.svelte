<script lang="ts">
	import  * as aq from 'arquero';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { columnMeans } from '$src/lib/data/stats';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { onMount } from 'svelte';
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';

	const sjrbcSites = $derived([...sitesTables.keys()].filter(k => k.startsWith('')));
	const sjrbcCols = $derived([...new Set(sjrbcSites.map(k => sitesTables.get(k)?.columnNames()).flat())]);
	onMount(() => {
		console.log('variableMetadata', variablesMetadata)
	});
</script>

<div id="test">
	<h2>Hello test</h2>

	<h3>sjrbcols</h3>
	<pre>
	{JSON.stringify(sjrbcCols, null, 2)}
	</pre>


	<h3>varsmetadata</h3>
	<pre>
	{JSON.stringify(variablesMetadata, null, 2)}
	</pre>
</div>

<style>
	#test {
		width: 100%;
		overflow: auto !important;
	}
	#test :global(table) {
		width: 100%;
		font-size: 0.8rem;
	}
</style>
