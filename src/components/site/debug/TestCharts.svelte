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
	import { fmtDate, niceTickNumber } from '$src/lib/utils';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';
	import AxisYZRight from '$src/components/chart/layercake/AxisYZRight.svelte';
	import { simpleStats } from '$src/lib/data/stats';

	let tableName = $state('sjrbc-1');
	let yVar: string = $state('phosphorus');
	let zVar: string = $state('do');
	// let tableName = $state('invert-107');
	// let yVar: string = $state('invertMacro');
	// let zVar: string = $state('invertIndiana');

	const table: ColumnTable | undefined = $derived(
		// sitesTables.get('sjrbc-1')?.select('date', 'temp', 'ph', 'chlorides')
		sitesTables
			.get(tableName)
			?.filter(aq.escape((d: any) => d[yVar] || d[zVar]))
			.reify()
	);
	const availableVars = $derived(table?.columnNames() || []);

	$effect(() => {
		console.log('tableName', tableName);
		console.log('yVar', yVar);
		console.log('zVar', zVar);
	});

	$effect(() => {
		if (availableVars.includes(yVar)) console.log('Y DATA', table?.select('date', yVar).objects());
		if (availableVars.includes(zVar)) console.log('Z DATA', table?.select('date', zVar).objects());

		console.log('yStats', yStats);
		console.log('zStats', zStats);
		console.log('yDomain', yDomain);
		console.log('zDomain', zDomain);
	});

	const yStats = $derived(simpleStats(yVar, table));
	const zStats = $derived(simpleStats(zVar, table));

	const points = $derived(table?.objects() || []);

	const tooltipPoints = $derived(table?.select('date', yVar, zVar).objects() || []);

	$effect(() => {
		console.log('TestCharts table', table);
		console.log('table.object(0)', table?.object(0));
	});

	function formatDate(d: number): any {
		const date = new Date(d);
		return fmtDate(date);
	}

	const color = '#ab00d6';
	const color2 = '#00d6ab';

	const yMetadataMin = $derived(variableMetadata[yVar]?.scale?.min ?? 0);
	const yDomainMin = $derived(
		typeof yMetadataMin === 'number' && typeof yStats.min === 'number'
			? Math.min(yMetadataMin, yStats.min)
			: yMetadataMin ?? yStats.min ?? 0
	);
	const yDomainMax = $derived(
		(yStats.count < 2 ? variableMetadata[yVar]?.scale?.max : niceTickNumber(yStats.max + yStats.range * 0.1, yStats.range * 10)) ?? 111
	);

	const zMetadataMin = $derived(variableMetadata[zVar]?.scale?.min ?? 0);
	const zDomainMin = $derived(
		typeof zMetadataMin === 'number' && typeof zStats.min === 'number'
			? Math.min(zMetadataMin, zStats.min)
			: zMetadataMin ?? zStats.min ?? 0
	);
	const zDomainMax = $derived(
		(zStats.count < 2 ? variableMetadata[zVar]?.scale?.max : niceTickNumber(zStats.max + zStats.range * 0.1, zStats.range * 10)) ?? 111
	);

	const yDomain: [number, number] = $derived([yDomainMin, yDomainMax]);
	const zDomain: [number, number] = $derived([zDomainMin, zDomainMax]);

	function genTicks(domainMin: number, domainMax: number, ts: number[]): number[] {
		const min = domainMin || ts[0];
		const max = domainMax || ts[ts.length - 1];
		const range = max - min;
		const q = range / 4;
		// console.log('yTicks', ts, 'min', min, 'max', max);
		const ticks = [min, min + q, min + 2 * q, min + 3 * q, max];
		const numTicks = ts.length;
		// return [0, 1, 2]
		return ticks.map((n) => niceTickNumber(n, range, n == max || n == min));
		// return ts;
	}

	function dateTicks(ts: number[]): number[] {
		// console.log('dateTicks', ts);
		if (ts.length < 3) return ts;
		const numRows = table!.numRows();

		const first = table!.get('date', 0)?.valueOf() || ts[0];
		const last = table!.get('date', numRows - 1)?.valueOf() || ts[ts.length - 1];
		const range = last - first;
		const q = range / 4;
		return [first, first + q, first + 2 * q, first + 3 * q, last];

		// return ts;
	}
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
				{yDomain}
				z={zVar}
				{zDomain}
				zScale={scaleLinear()}
				zRange={({ height }: any) => [height, 0]}
				debug
			>
				<!-- Components go here -->
				<Svg>
					<AxisX tickMarks={true} snapLabels={false} format={formatDate} ticks={dateTicks} />
					<AxisY
						gridlines={false}
						tickMarks={true}
						tickStroke={color}
						ticks={(ts: number[]) => genTicks(yDomain[0], yDomain[1], ts)}
					/>
					<AxisYZRight
						gridlines={false}
						tickMarks={true}
						ticks={(ts: number[]) => genTicks(zDomain[0], zDomain[1], ts)}
					/>
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

	#test :global(.x-axis .tick:first-child text) {
		/* fill: #ff0db9; */
		/* transform-origin: 0 0px; */
		translate: 12px 0px;
		/* transform: rotate(20deg); */
	}

	#test :global(.x-axis .tick:last-child text) {
		/* fill: #ff0db9; */
		/* transform-origin: 0 0px; */
		translate: -10px 0px;
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
