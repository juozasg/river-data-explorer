<script lang="ts">
	import * as aq from 'arquero';
	import { LayerCake, Svg, Canvas, Html } from 'layercake';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { onMount } from 'svelte';
	import ScatterCanvas from '$src/components/chart/layercake/Scatter.svelte';
	import AxisX from '$src/components/chart/layercake/AxisX.svelte';
	import AxisY from '$src/components/chart/layercake/AxisY.svelte';
	import Line from '$src/components/chart/layercake/Line.svelte';
	import { fmtDate } from '$src/lib/utils';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';

	const table: ColumnTable | undefined = $derived(sitesTables.get('sjrbc-1')?.select('date', 'ph'));
	const points = $derived(table?.objects() || [])

	// // Define some data
	// const points = [
	// 	{ x: 0, y: 0 },
	// 	{ x: 5, y: 10 },
	// 	{ x: 10, y: 20 },
	// 	{ x: 15, y: 30 },
	// 	{ x: 20, y: 220 }
	// ];



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
		// return date.getFullYear();
		return fmtDate(date);
	}

	const color = '#ab00d6';
</script>

<div id="box">
	BOX
</div>

<div id="test">
	<h2>Hello TestCharts</h2>

	<div class="chart-container">
		{#if table}
		<LayerCake data={points} x="date" y="ph" >
			<!-- Components go here -->
			<Svg>
				<AxisX tickMarks={true} snapLabels={false} ticks={5} format={formatDate} />
				<AxisY />
				<Line stroke={color}/>
				<Scatter r={3} fill={color}/>
			</Svg>
			<Html>
				<SharedTooltip formatTitle={formatDate}/>
			</Html>
		</LayerCake>
		{/if}
	</div>
</div>

<style>
	#test :global(.x-axis .tick text) {
    fill: #410db9;
		/* transform-origin: 0 0px; */
		/* translate: 20px 10px; */
		/* transform: rotate(20deg); */
  }
	#test :global(.x-axis .tick:nth-child(even) text) {
    fill: #410db9;
		/* transform-origin: 0 0px; */
		translate: 0px 14px;
		/* transform: rotate(20deg); */
  }
	#box {
		width: 100px;
		height: 200px;
		background-color: purple;
	}
	.chart-container {
		width: 400px;
		height: 300px;
		border:  1px solid red;
		margin-left: 2rem;
		/* position: absolute; */
		/* background-color: blueviolet; */
	}

	#test {
		width: 100%;
		height: 800px;
		border: 1px solid blue;
		overflow: visible;
		/* position: absolute; */
		top: 50px;
		left: 50px;
	}
	#test :global(table) {
		width: 100%;
		font-size: 0.8rem;
	}
</style>
