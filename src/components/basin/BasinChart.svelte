<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import BrushedYzChart from '../chart/BrushedYZChart.svelte';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';

	let tableName = $state('');

	$effect(() => {
		tableName = selectedSite.site ? selectedSite.site.id : '';
	});
	let yVar: string = $state('temp');
	let zVar: string = $state('do');

	const table: ColumnTable | undefined = $derived(sitesTables.get(tableName)?.reify());
</script>

<div>
	{#if table}
		<BrushedYzChart {table} {yVar} {zVar} />
	{/if}
</div>
