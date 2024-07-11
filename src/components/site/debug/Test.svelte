<script lang="ts">
	import  * as aq from 'arquero';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { columnMeans } from '$src/lib/data/stats';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { onMount } from 'svelte';

	const invert1: ColumnTable | undefined = $derived(sitesTables.get('invert-1'));
	const invert1Means = $derived(invert1 && columnMeans(invert1));

	const invertTables = $derived([...sitesTables].filter(([k, v]) => k.includes('invert')).map(([k, v]) => v));
	const inverts = $derived(invertTables.length > 0 ? invertTables.reduce((acc, t) => acc.concat(t)) : undefined);
	console.log('TEST SCRIPT', );

	onMount(() => {
		console.log('TEST MOUNT');
	});
	// $inspect('reduced invs', inverts);
</script>

<div id="test">
	<h2>Hello test</h2>

	<h3>INVERTS counts</h3>
	{@html inverts?.groupby('invertNarrative').count().orderby('count').select('invertNarrative').toHTML()}

	<h3>invert-1 HTML</h3>
	{@html invert1?.toHTML()}


	<h3>invert-1 means</h3>
	<pre>
	{JSON.stringify(invert1Means, null, 2)}
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
