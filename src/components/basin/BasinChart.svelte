<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import BrushedYzChart from '../chart/BrushedYZChart.svelte';
	import ElementResizeObserver from '../website/ElementResizeObserver.svelte';
	import type { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';
	import Icon from '@iconify/svelte';
	import type { Site } from '$src/lib/types/site';


	type Props = {
		dataSelection: DataSelectionState;
		selectedSite?: Site;
		onDateSelected?: (d: Date) => void;
	};
	const { dataSelection, onDateSelected, selectedSite }: Props = $props();

	// let siteTableName = $state('');

	let chartWidth = $state(200);
	let chartHeight = $state(200);

	// TODO: this is not real data
	const siteTable: ColumnTable | undefined = $derived(
		sitesTables.get(dataSelection.ySite?.id || dataSelection.zSite?.id || '')?.reify()
	);

	// $effect(() => {
	// 	console.log('BASIN CHART siteTable', siteTable);
	// 	console.log('BASIN CHART dataSelection', dataSelection.yVar, JSON.stringify(dataSelection));
	// });


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
			{dataSelection}
			{chartWidth}
			{chartHeight}
			{onDateSelected}
		/>
	{:else if !selectedSite?.id}
		<div class="placeholder">
			<h2>
				<Icon class="icon" height="none" icon="lets-icons:arrow-drop-up"/>
				Click a site marker on the map to select
				<Icon class="icon" height="none" icon="lets-icons:arrow-drop-up"/>
			</h2>
		</div>
	{:else if (!dataSelection.yVar && !dataSelection.zVar)}
		<div class="placeholder">
			<h2>Click a variable to graph  <Icon class="icon" height="none" icon="lets-icons:arrow-drop-right"/></h2>
		</div>
	{/if}
</div>


<style>
	.placeholder :global(.icon) {
		height: 56px;
		width: 56px;
		position: relative;
		top: 18px;
		left: -16px;
		margin-right: -32px;

		/* line-height: 4rem; */
	}
</style>
