<script lang="ts">
	import * as aq from 'arquero';
	import { LayerCake, Svg, Canvas, Html } from 'layercake';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { onMount } from 'svelte';
	import ScatterCanvas from '$src/components/chart/layercake/ScatterCanvas.svelte';
	import AxisX from '$src/components/chart/layercake/AxisX.svelte';
	import AxisY from '$src/components/chart/layercake/AxisY.svelte';
	import Line from '$src/components/chart/layercake/Line.svelte';
	import { fmtDate } from '$src/lib/utils';

	const table: ColumnTable | undefined = $derived(sitesTables.get('sjrbc-1'));

	// Define some data
	const points = [
		{ x: 0, y: 0 },
		{ x: 5, y: 10 },
		{ x: 10, y: 20 },
		{ x: 15, y: 30 },
		{ x: 20, y: 220 }
	];



	$effect(() => {
		console.log('TestCharts', table);
		console.log('date 0', table?.object(0))
	});


	// onMount(() => {
	// 	console.log('TestCharts', table)
	// });

	function formatDate(d: number): any {
		const date = new Date(d);
		// console.log(d);
		return fmtDate(date);
	}
</script>

<div id="test">
	<h2>Hello TestCharts</h2>

	<div class="chart-container">
		{#if table}
		<LayerCake data={table.objects()} x="date" y="ph" >
			<!-- Components go here -->
			<Svg>
				<AxisX tickMarks={true} snapLabels={true} ticks={5} format={formatDate} />
				<AxisY />
				<Line/>
			</Svg>
		</LayerCake>
		{/if}
	</div>
</div>

<style>
	.chart-container {
		width: 400px;
		height: 300px;
		border:  1px solid red;
		margin-left: 2rem;
		/* background-color: blueviolet; */
	}

	#test {
		width: 100%;
		height: 800px;
		border: 1px solid blue;
		overflow: auto !important;
		position: relative;
	}
	#test :global(table) {
		width: 100%;
		font-size: 0.8rem;
	}
</style>
