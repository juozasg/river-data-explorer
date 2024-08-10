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
	import { aremove, fmtDate, niceTickNumber } from '$src/lib/utils';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';
	import AxisYZRight from '$src/components/chart/layercake/AxisYZRight.svelte';
	import { simpleStats } from '$src/lib/data/stats';
	import { sites, Sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$lib/types/site';

	// let tableName = $state('invert-107');
	// let yVar: string = $state('invertMacro');
	// let zVar: string = $state('invertIndiana');

	let tableDataset: string = $state('sjrbc');
	let tableNum: number = $state(1);

	const tableName = $derived(`${tableDataset}-${tableNum}`);
	let yVar: string = $state('fishIbi');
	let zVar: string = $state('fishIbi');

	$effect(() => {
		if (!availableVars.includes(yVar)) yVar = availableVars[0];
		if (!availableVars.includes(zVar)) zVar = availableVars[1] || availableVars[0];
		if (!availableTableNums.includes(tableNum)) tableNum = availableTableNums[0];
	});

	const fullTable: ColumnTable | undefined = $derived(
		sitesTables
			.get(tableName)
			?.filter(aq.escape((d: any) => d[yVar] || d[zVar]))
			.reify()
	);

	let tableSliceFrom: number = $state(0);
	let tableSliceTo: number | undefined = $state(40);

	$effect(() => {
		// changing table will change the range
		tableSliceFrom = 0;
		tableSliceTo = fullTable?.numRows();
	});

	$effect(() => {

		// if(tableSliceTo && tableSliceFrom >= (tableSliceTo + 1)) {
			if(typeof tableSliceTo == 'number' && tableSliceFrom >= (tableSliceTo - 1) ) {
			console.log("tableSliceFrom > tableSliceTo", tableSliceFrom, tableSliceTo)
			tableSliceFrom = tableSliceTo - 1;
			// tableSliceTo = tableSliceFrom + 1;
			if(tableSliceFrom < 0) {
				tableSliceFrom = 0;
				tableSliceTo = 1;
			}

			// if(tableSliceTo >= fullTable!.numRows()) {
			// 	tableSliceTo = fullTable!.numRows() - 1;
			// }
		}
	});

	const table = $derived.by(() => {
		if (!fullTable) return;
		// return fullTable;
		let endIndex: undefined | number = tableSliceTo
		if(typeof endIndex == 'number' && endIndex >= fullTable.numRows()) endIndex = undefined;

		return fullTable?.slice(tableSliceFrom, endIndex);
	});

	const availableVars = $derived(aremove(table?.columnNames(), 'invertNarrative', 'date') || []);
	const availableDatasetSites = $derived(Sites.groupedBy(sites.withDataTables(), 'dataset'));
	const availableDatasetNames = $derived([...availableDatasetSites.keys()]);
	const availableTableNums = $derived(
		availableDatasetSites.get(tableDataset)?.map((s: Site) => s.num) || []
	);

	$effect(() => {
		console.log('availableDatasetSites', availableDatasetSites);
		console.log('availableDatasetNames', availableDatasetNames);
		console.log('availableTableNums', availableTableNums);
	});
	// const available

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

	const yStats = $derived(simpleStats(yVar, fullTable));
	const zStats = $derived(simpleStats(zVar, fullTable));

	const yRadius = $derived(yStats.count > 2 ? 4 : 7);
	const zRadius = $derived(zStats.count > 2 ? 4 : 7);

	const points = $derived(table?.objects() || []);

	const tooltipPoints = $derived.by(() => {
		const tooltipCols = ['date'];
		if (yStats.count > 0) tooltipCols.push(yVar);
		if (zStats.count > 0) tooltipCols.push(zVar);

		return table?.select(tooltipCols).objects() || [];
	});

	// $effect(() => {
	// 	console.log('TestCharts table', table);
	// 	console.log('table.object(0)', table?.object(0));
	// });

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
		(yStats.count < 2
			? variableMetadata[yVar]?.scale?.max
			: niceTickNumber(yStats.max + yStats.range * 0.1, yStats.range * 10)) ?? 111
	);

	const zMetadataMin = $derived(variableMetadata[zVar]?.scale?.min ?? 0);
	const zDomainMin = $derived(
		typeof zMetadataMin === 'number' && typeof zStats.min === 'number'
			? Math.min(zMetadataMin, zStats.min)
			: zMetadataMin ?? zStats.min ?? 0
	);
	const zDomainMax = $derived(
		(zStats.count < 2
			? variableMetadata[zVar]?.scale?.max
			: niceTickNumber(zStats.max + zStats.range * 0.1, zStats.range * 10)) ?? 111
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

	function dateTicks(table: ColumnTable, suggestedTicks: number[]): number[] {
		// console.log('dateTicks', ts);
		if (suggestedTicks.length < 3) return suggestedTicks;
		const numRows = table!.numRows();

		const first = table.get('date', 0)?.valueOf() || suggestedTicks[0];
		const last =
			table.get('date', numRows - 1)?.valueOf() || suggestedTicks[suggestedTicks.length - 1];
		const range = last - first;
		const q = range / 4;
		return [first, first + q, first + 2 * q, first + 3 * q, last];

		// return ts;
	}
</script>

<!-- <div id="box">BOX</div> -->

<h4>Dataset: {tableDataset} Num: {tableNum}</h4>
<div style="display: flex">
	<select bind:value={tableDataset} style="margin-right: 1rem;">
		{#each availableDatasetNames as name}
			<option value={name}>{name}</option>
		{/each}
	</select>
	<select bind:value={tableNum}>
		{#each availableTableNums as num}
			<option value={num}>{num}</option>
		{/each}
	</select>
</div>

{#if fullTable}
	<div style="display: flex">
		<input
			type="range"
			min="0"
			max={fullTable.numRows() - 2}
			bind:value={tableSliceFrom}
			step="1"
			id="slider-from"
			style="margin-right: 2rem"
		/>
		<input
			type="range"
			min="1"
			max={fullTable.numRows() - 1}
			bind:value={tableSliceTo}
			step="1"
			id="slider-to"
			style="margin-right: 2rem"
		/>
		<p>{tableSliceFrom} - {tableSliceTo}</p>
	</div>
{/if}

<div style="display: flex">
	<h4 style="color: {color}">Y var: {yVar}</h4>
	<select bind:value={yVar} style="margin-right: 2rem; margin-left: 1rem;">
		{#each availableVars as varname}
			<option value={varname}>{varname}</option>
		{/each}
	</select>

	<h4 style="color: {color2}">Z var: {zVar}</h4>
	<select bind:value={zVar} style="margin-left: 1rem;">
		{#each availableVars as varname}
			<option value={varname}>{varname}</option>
		{/each}
	</select>
</div>
<div id="test">
	<h2>TestCharts</h2>
	<div class="chart-container">
		{#if table && points.length > 0}
			<LayerCake
				data={points}
				x="date"
				y={yVar}
				{yDomain}
				z={zVar}
				{zDomain}
				zScale={scaleLinear()}
				zRange={({ height }: any) => [height, 0]}
			>
				<!-- Components go here -->
				<Svg>
					<AxisX
						tickMarks={true}
						snapLabels={false}
						format={formatDate}
						ticks={(ts: number[]) => dateTicks(table, ts)}
					/>
					{#if yStats.count > 0}
						<AxisY
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genTicks(yDomain[0], yDomain[1], ts)}
							{color}
						/>

						<Line stroke={color} />
						<Scatter r={yRadius} fill={color} />
					{/if}
					{#if zStats.count > 0}
						<AxisYZRight
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genTicks(zDomain[0], zDomain[1], ts)}
						/>
						<Line stroke={color2} dataSource="z" />
						<Scatter r={zRadius} fill={color2} dataSource="z" />
					{/if}
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
		/* border: 1px solid red; */
		margin-left: 2rem;
		position: absolute;
		/* background-color: blueviolet; */
	}

	h4 {
		margin-bottom: 2px;
	}

	select {
		margin-bottom: 1rem;
		font-size: 110%;
	}

	#test {
		width: 100%;
		height: 800px;
		/* border: 1px solid blue; */
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
