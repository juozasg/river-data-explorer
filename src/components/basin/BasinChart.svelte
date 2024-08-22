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

	let chartWidth = $state(200);
	let chartHeight = $state(200);

	$effect(() => {
		console.log('resized chart', chartWidth, chartHeight);
	});

	const table: ColumnTable | undefined = $derived(sitesTables.get(tableName)?.reify());

	let chartLayoutElement: HTMLDivElement | undefined = $state();
	let observer: ResizeObserver | undefined = $state();

	if (typeof window == 'object') {
		observer = new window.ResizeObserver((entries) => {
			const entry = entries[0];
			// console.log('chartLayoutElement contentRect', entry.contentRect);

			chartWidth = entry.contentRect.width;
			chartHeight = entry.contentRect.height;
		});
	}

	$effect(() => {
		if (chartLayoutElement && observer) {
			// console.log('OBSERVE chartLayoutElement', chartLayoutElement);
			observer.observe(chartLayoutElement);
		}
	});
</script>

<div bind:this={chartLayoutElement} style="widht: 100%; height: 100%;">
	{#if table}
		<BrushedYzChart {table} {yVar} {zVar} {chartWidth} {chartHeight} />
	{/if}
</div>
