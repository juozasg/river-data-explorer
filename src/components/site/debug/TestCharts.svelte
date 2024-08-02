<script lang="ts">
	import  * as aq from 'arquero';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { columnMeans } from '$src/lib/data/stats';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { onMount } from 'svelte';

	const table: ColumnTable | undefined = $derived(sitesTables.get('sjrbc-1'));



	onMount(() => {
		console.log('TestCharts', table)
	});
</script>

<div id="test">
	<h2>Hello TestCharts</h2>



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
