<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import BrushedYZChart from '../chart/BrushedYZChart.svelte';
	import ElementResizeObserver from '../website/ElementResizeObserver.svelte';
	import type { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';
	import Icon from '@iconify/svelte';
	import type { Site } from '$src/lib/types/site';
	import type { MapFeatureSelectionState } from '$src/appstate/map/featureState.svelte';
	import ChangeRegionHeader from './ChangeRegionHeader.svelte';
	import { concatTablesAllColumns } from '$src/lib/data/tableHelpers';
	import { isCategoricalVar } from '$src/appstate/variablesMetadata.svelte';


	type Props = {
		dataSelection: DataSelectionState;
		selectedSite?: Site;
		selectedRegion: MapFeatureSelectionState;

		onDateSelected?: (d: Date) => void;
	};
	const { dataSelection, onDateSelected, selectedSite, selectedRegion }: Props = $props();

	// let siteTableName = $state('');

	let chartWidth = $state(200);
	let chartHeight = $state(200);

	// TODO: this is not real data
	const combinedTable: ColumnTable | undefined = $derived.by(() => {
		let yTable = sitesTables.get(dataSelection.ySite?.id || '');
		let zTable = sitesTables.get(dataSelection.zSite?.id || '');

		if (!yTable && !zTable) {
			return;
		}

		let yVar = dataSelection.yVar;
		let zVar = dataSelection.zVar;

		if(yVar && isCategoricalVar(yVar)) {
			yVar = undefined;
		}

		if(zVar && isCategoricalVar(zVar)) {
			zVar = undefined;
		}

		if(yTable && yTable.numRows() > 0 && yVar && yTable.columnNames().includes(yVar)) {
			yTable = yTable.select(['date', yVar]).reify();
		}

		if(zTable && zTable.numRows() > 0 && zVar && zTable.columnNames().includes(zVar)) {
			zTable = zTable.select(['date', zVar]).reify();
		}

		return concatTablesAllColumns([yTable, zTable]).orderby('date').reify();

		// sitesTables.get(dataSelection.ySite?.id || dataSelection.zSite?.id || '')?.reify()
	});

	// $effect(() => {
	// 	console.log('BASIN CHART dataSelection', dataSelection.yVar, JSON.stringify(dataSelection));
	// });


	let chartLayoutElement: HTMLDivElement | undefined = $state();

	// const ds = () => {console.log('render!!!!', dataSelection, JSON.stringify(dataSelection)); return JSON.stringify(dataSelection)}
</script>

<div bind:this={chartLayoutElement} style="width: 100%; height: 100%;">
	<ElementResizeObserver
		element={chartLayoutElement}
		bind:width={chartWidth}
		bind:height={chartHeight}
	/>


	{#if combinedTable && (dataSelection.yVar || dataSelection.zVar)}
		<BrushedYZChart
			table={combinedTable}
			{dataSelection}
			{chartWidth}
			{chartHeight}
			{onDateSelected}
		/>
	{:else if !selectedSite?.id}
		<div class="placeholder click-site">
			<h2>
				<Icon class="icon" height="none" icon="lets-icons:arrow-drop-up"/>
				Click a site marker on the map to select
				<Icon class="icon" height="none" icon="lets-icons:arrow-drop-up"/>
			</h2>
		</div>
		<ChangeRegionHeader blink={false} {selectedRegion} />
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

	.placeholder.click-site {
		text-align: center;
	}
</style>
