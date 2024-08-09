<script lang="ts">
	import * as aq from 'arquero';
	const op = aq.op;
	import { LayerCake, Svg, Canvas, Html } from 'layercake';
	import { scaleLinear } from 'd3-scale';

	import { variableMetadata } from '$src/appstate/variableMetadata';

	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import AxisX from '$src/components/chart/layercake/AxisX.svelte';
	import AxisY from '$src/components/chart/layercake/AxisY.svelte';
	import Line from '$src/components/chart/layercake/Line.svelte';
	import { fmtDate } from '$src/lib/utils';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';
	import AxisYZRight from '$src/components/chart/layercake/AxisYZRight.svelte';

	let yVar: string = $state('ecoli');
	let zVar: string = $state('temp');

	let tableName = $state('ecoli-1');

	const table: ColumnTable | undefined = $derived(
		// sitesTables.get('sjrbc-1')?.select('date', 'temp', 'ph', 'chlorides')
		sitesTables.get(tableName)?.filter(aq.escape((d: any) => d[yVar] || d[zVar] ))
	);

	const availableVars = $derived(table?.columnNames() || []);

	const points = $derived(table?.objects() || []);


	const tooltipPoints = $derived(
		table?.select('date', yVar, zVar).objects() || []
	);


	$effect(() => {
		console.log('TestCharts', table);
		console.log('date 0', table?.object(0));
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
	const color2 = '#00d6ab';

	// const yMin = 0;
	// const zMin = 5.5;

	const yDomain: [number, number | null] = $derived([variableMetadata[yVar]?.scale?.min || 0, yVar === 'ph' ? variableMetadata[yVar]?.scale?.max || null : null]);
	// const yDomain: any[] = [0, null];
	const zDomain: [number, number | null] = $derived([variableMetadata[zVar]?.scale?.min || 0, zVar === 'ph' ? variableMetadata[zVar]?.scale?.max || null : null]);
	$inspect(zDomain);
	// const zDomain = [0, 6];
</script>

<!-- <div id="box">BOX</div> -->

<h4>Datatable: {tableName}</h4>
<select bind:value={tableName}>
	{#each sitesTables.keys() as name}
		<option value={name}>{name}</option>
	{/each}
</select>

<h4>Y var: {yVar}</h4>
<select bind:value={yVar}>
	{#each availableVars as varname}
		<option value={varname}>{varname}</option>
	{/each}
</select>


<h4>Z var: {zVar}</h4>
<select bind:value={zVar}>
	{#each availableVars as varname}
		<option value={varname}>{varname}</option>
	{/each}
</select>
<div id="test">
	<h2>Hello TestCharts</h2>
	<div class="chart-container">
		{#if table && table.columnNames().includes(yVar) && table.columnNames().includes(zVar)}
			<LayerCake
				data={points}
				x="date"
				y={yVar}
				yDomain={yDomain}
				yNice={4}
				z={zVar}
				zNice={4}
				zDomain={zDomain}
				zScale={scaleLinear()}
				zRange={({ height }: any) => [height, 0]}
				>
				<!-- debug -->
				<!-- Components go here -->
				<Svg>
					<AxisX tickMarks={true} snapLabels={false} ticks={5} format={formatDate} />
					<AxisY gridlines={false} tickMarks={true} />
					<AxisYZRight gridlines={false} tickMarks={true} />
					<Line stroke={color} />
					<Line stroke={color2} dataSource="z" />
					<Scatter r={4} fill={color} />
					<Scatter r={4} fill={color2} dataSource="z" />
				</Svg>
				<Html>
					<SharedTooltip formatTitle={formatDate} dataset={tooltipPoints} />
				</Html>
			</LayerCake>
		{/if}
	</div>
</div>

<style>
	#test :global(.x-axis .tick text) {
		/* fill: #410db9; */
		/* transform-origin: 0 0px; */
		/* translate: 20px 10px; */
		/* transform: rotate(20deg); */
	}
	#test :global(.x-axis .tick:nth-child(even) text) {
		/* fill: #410db9; */
		/* transform-origin: 0 0px; */
		translate: 0px 14px;
		/* transform: rotate(20deg); */
	}
	#box {
		width: 100px;
		height: 200px;
		background-color: purple;
	}

	/* #test :global(.layercake-container) {
		position: absolute !important;
		top: 0;
		left: 0;
	} */
	#test :global(.layercake-container .tooltip) {
		/* position: absolute !important; */
		top: 100px !important;
		/* left: 0; */
	}
	.chart-container {
		width: 400px;
		height: 300px;
		border: 1px solid red;
		margin-left: 2rem;
		position: absolute;
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
