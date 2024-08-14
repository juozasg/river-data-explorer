<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import BrushedYzChart from '../chart/BrushedYZChart.svelte';

	let tableName = $state('steuben-8');
	let yVar: string = $state('temp');
	let zVar: string = $state('do');

	const table: ColumnTable | undefined = $derived(sitesTables.get(tableName)?.reify());
</script>

<div>
	{#if table}
		<BrushedYzChart {table} {yVar} {zVar} />
	{/if}
</div>
