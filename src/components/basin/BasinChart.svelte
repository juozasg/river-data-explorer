<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import BrushedYzChart from '../chart/BrushedYZChart.svelte';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';
	import ElementResizeObserver from '../website/ElementResizeObserver.svelte';

	let siteTableName = $state('');

	$effect(() => {
		siteTableName = selectedSite.site ? selectedSite.site.id : '';
	});

	const { yVar, zVar }: { yVar: string; zVar: string } = $props();

	let chartWidth = $state(200);
	let chartHeight = $state(200);

	const siteTable: ColumnTable | undefined = $derived(sitesTables.get(siteTableName)?.reify());


	let chartLayoutElement: HTMLDivElement | undefined = $state();
</script>

<div bind:this={chartLayoutElement} style="widht: 100%; height: 100%;">
	<ElementResizeObserver element={chartLayoutElement} bind:width={chartWidth} bind:height={chartHeight} />
	{#if siteTable}
		<BrushedYzChart table={siteTable} {yVar} {zVar} {chartWidth} {chartHeight} />
	{/if}
</div>
