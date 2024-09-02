<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import BrushedYzChart from '../chart/BrushedYZChart.svelte';
	import ElementResizeObserver from '../website/ElementResizeObserver.svelte';
	import type { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';

	type Props = {
		dataSelection: DataSelectionState;
	};
	const { dataSelection }: Props = $props();

	let siteTableName = $state('');

	let chartWidth = $state(200);
	let chartHeight = $state(200);

	const siteTable: ColumnTable | undefined = $derived(
		sitesTables.get(dataSelection.ySite?.id || '')?.reify()
	);

	$effect(() => {
		console.log('SiteStatsPanel siteTable', siteTable);
		console.log('SiteStatsPanel dataSelection', JSON.stringify(dataSelection));
	});

	let chartLayoutElement: HTMLDivElement | undefined = $state();

	const ds = () => {console.log('render!!!!', dataSelection, JSON.stringify(dataSelection)); return JSON.stringify(dataSelection)}
</script>

<div bind:this={chartLayoutElement} style="width: 100%; height: 100%;">
	<ElementResizeObserver
		element={chartLayoutElement}
		bind:width={chartWidth}
		bind:height={chartHeight}
	/>


	{#if siteTable && (dataSelection.yVar || dataSelection.zVar)}
		<BrushedYzChart
			table={siteTable}
			yVar={dataSelection.yVar}
			zVar={dataSelection.zVar}
			{chartWidth}
			{chartHeight}
		/>
	{:else if !dataSelection.ySite?.id}
		<div class="placeholder">
			<pre>{ds()}</pre>
			<h2>Click a site marker on the map to select</h2>
		</div>
	{:else if !dataSelection.yVar}
		<div class="placeholder">
			<h2>Click a variable on the data table to graph {'->'}</h2>
		</div>
	{/if}
</div>
