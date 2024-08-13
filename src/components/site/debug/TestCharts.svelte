<script lang="ts">
	import * as aq from 'arquero';
	import { scaleLinear } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import { variableMetadata } from '$src/appstate/variableMetadata';

	import type { Site } from '$lib/types/site';
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { sites, Sites } from '$src/appstate/sites.svelte';
	import AxisX from '$src/components/chart/layercake/AxisX.svelte';
	import AxisY from '$src/components/chart/layercake/AxisY.svelte';
	import AxisYZRight from '$src/components/chart/layercake/AxisYZRight.svelte';
	import Brush from '$src/components/chart/layercake/Brush.html.svelte';
	import Line from '$src/components/chart/layercake/Line.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import { simpleStats } from '$src/lib/data/stats';
	import { aremove, fmtDate, niceTickNumber } from '$src/lib/utils';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { genXDateTicks, genYTicks } from '$src/lib/chartTicks';


	let tableDataset: string = $state('sjrbc');
	let tableNum: number = $state(1);

	const tableName = $derived(`${tableDataset}-${tableNum}`);
	// let yVar: string = $state('ph');
	// let zVar: string = $state('ecoli');
	let yVar: string = $state('bod');
	let zVar: string = $state('bodPercent');

	const yVarUnit = $derived(variableMetadata[yVar]?.unit || '');
	const zVarUnit = $derived(variableMetadata[zVar]?.unit || '');

	const parensForunit = (unit: string) => (unit ? ` (${unit})` : '');

	const yVarlabel = $derived(variableMetadata[yVar]?.label + ` ${parensForunit(yVarUnit)}` || yVar);
	const zVarlabel = $derived(variableMetadata[zVar]?.label + ` ${parensForunit(zVarUnit)}` || zVar);

	$effect(() => {
		if (!availableVars.length) return;
		if (!availableVars.includes(yVar)) yVar = availableVars[0];
		if (!availableVars.includes(zVar)) zVar = availableVars[1] || availableVars[0];
		if (!availableTableNums.includes(tableNum)) tableNum = availableTableNums[0];
	});

	const fullTable: ColumnTable | undefined = $derived(
		sitesTables
			.get(tableName)
			// ?.filter(aq.escape((d: any) => d[yVar] || d[zVar]))
			.reify()
	);

	let brushMinIndex: number | null = $state(null);
	let brushMaxIndex: number | null = $state(null);

	const table = $derived.by(() => {
		if (!fullTable) return;

		const sliceIndex =
			brushMaxIndex == null
				? undefined
				: brushMaxIndex >= fullTable.numRows() - 1
					? undefined
					: brushMaxIndex + 1;

		// console.log('slicing fullTable', brushMinIndex, sliceIndex);
		return fullTable?.slice(brushMinIndex || 0, sliceIndex);
	});

	const availableVars = $derived(aremove(table?.columnNames(), 'invertNarrative', 'date') || []);
	const availableDatasetSites = $derived(Sites.groupedBy(sites.withDataTables(), 'dataset'));
	const availableDatasetNames = $derived([...availableDatasetSites.keys()]);
	const availableTableNums = $derived(
		availableDatasetSites.get(tableDataset)?.map((s: Site) => s.num) || []
	);
	$effect(() => {
		console.log('tableName', tableName);
		console.log('yVar', yVar);
		console.log('zVar', zVar);
	});


	const yStats = $derived(simpleStats(yVar, fullTable));
	const zStats = $derived(simpleStats(zVar, fullTable));

	const yRadius = $derived(yStats.count > 2 ? 4 : 7);
	const zRadius = $derived(zStats.count > 2 ? 4 : 7);

	const points = $derived(table?.objects() || []);

	const fullPoints = $derived(fullTable?.objects() || []);

	const tooltipPoints = $derived.by(() => {
		const tooltipCols = ['date'];
		if (yStats.count > 0) tooltipCols.push(yVar);
		if (zStats.count > 0) tooltipCols.push(zVar);

		// return table?.objects() || [];
		return table?.select(tooltipCols).objects() || [];
	});

	function formatDate(d: number): any {
		const date = new Date(d);
		return fmtDate(date);
	}

	function formatTTKey(key: string): string {
		const keycolor = key == yVar ? color : key == zVar ? color2Darker : '#444';
		const label = variableMetadata[key]?.label || key;
		const unit = variableMetadata[key]?.unit || '';
		// console.log(key, label, keycolor)
		// const keycolor = '#444';
		return `<span style="font-weight: 600; color: ${keycolor}">${label}</bold>`;
	}

	function formatTTValue(key: string, value: any): string {
		const unit = variableMetadata[key]?.unit || '';
		return `${value} ${unit}`;
	}

	const color = '#ab00d6';
	const color2 = '#00d6ab';
	const color2Darker = '#00af8c';

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

	let testElement: HTMLElement | null = $state(null);
	let brushContainer: HTMLElement | null = $state(null);

	const tickTextElements = () =>
		(testElement?.querySelectorAll('.x-axis .tick text') as NodeListOf<HTMLElement>) ||
		([] as HTMLElement[]);

	const brushOn = (e) => {
		brushContainer!.style.opacity = '1';

		const ticks = tickTextElements().forEach((t) => {
			t.style.opacity = '0';
		});
	};

	const brushOff = (e) => {
		brushContainer!.style.opacity = '0.1';
		const ticks = tickTextElements().forEach((t) => {
			t.style.opacity = '1';
		});
	};
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
<div id="test" bind:this={testElement}>
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
						ticks={(ts: number[]) => genXDateTicks(table, ts)}
					/>
					{#if yStats.count > 0}
						<AxisY
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(yDomain[0], yDomain[1], ts)}
							{color}
						/>

						<Line stroke={color} />
						<Scatter r={yRadius} fill={color} />
					{/if}
					{#if zStats.count > 0 && zVar !== yVar}
						<AxisYZRight
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(zDomain[0], zDomain[1], ts)}
							color={color2Darker}
						/>
						<Line stroke={color2} dataSource="z" />
						<Scatter r={zRadius} fill={color2} dataSource="z" />
					{/if}
				</Svg>
				<Html>
					<SharedTooltip
						formatTitle={formatDate}
						dataset={tooltipPoints}
						formatKey={formatTTKey}
						formatValue={formatTTValue}
					/>
					<div class="y-labels" style="font-weight: bold; font-size: 0.9rem; display:flex; justify-content: space-between">
						<div class="y-axis-label y-label" style="color:{color};margin-left: 0.2rem">
							{yVarlabel}
						</div>
						<div class="z-axis-label y-label" style="color:{color2Darker}; margin-right: 0.1rem; text-align: right">
							{zVarlabel}
						</div>
					</div>
				</Html>
			</LayerCake>
		{/if}
	</div>
	<!-- </div> -->

	<div
		class="brush-container"
		style="opacity:0.1"
		onmouseenter={brushOn}
		onmouseleave={brushOff}
		ontouchmove={brushOn}
		ontouchmovecapture={brushOn}
		bind:this={brushContainer}
	>
		{#if table && fullPoints.length > 0}
			<!-- padding={{ top: 5 }} -->
			<LayerCake
				data={fullPoints}
				x="date"
				y={yVar}
				{yDomain}
				z={zVar}
				{zDomain}
				zScale={scaleLinear()}
				zRange={({ height }: any) => [height, 0]}
			>
				<Svg>
					{#if yStats.count > 0}
						<Line stroke={color} />
						<Scatter
							r={yRadius - 1}
							fill={color}
							filterIndexRange={[brushMinIndex, brushMaxIndex]}
						/>
					{/if}
					{#if zStats.count > 0 && zVar !== yVar}
						<Line stroke={color2} dataSource="z" ’ />
						<Scatter
							r={zRadius - 1}
							fill={color2}
							dataSource="z"
							filterIndexRange={[brushMinIndex, brushMaxIndex]}
						/>
					{/if}
				</Svg>
				<Html>
					<Brush
						min={null}
						max={null}
						bind:snappedMinIndex={brushMinIndex}
						bind:snappedMaxIndex={brushMaxIndex}
					/>
				</Html>
			</LayerCake>
		{/if}
	</div>
</div>

<style>

	.y-labels {
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: -19px;

		.y-label {
			height: 1.4rem;
			background-color: white;
		}
	}

	.y-labels:hover {
		overflow: visible;
	}

	#test :global(.x-axis .tick text) {
		/* fill: #410db9; */
		/* transform-origin: 0 0px; */
		/* translate: 20px 10px; */
		/* transform: rotate(20deg); */
		/* font-weight: 700 !important; */


	}

	#test :global(.y-axis .tick text) {
		stroke: #ab00d6;
		stroke-width: 0.5;
	}
	#test :global(.z-axis .tick text) {
		stroke: #00af8c;
		stroke-width: 0.5;
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
		/* top: 100px !important; */
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

	.brush-container {
		height: 22px;
		bottom: 50px;
		width: 396px;
		margin-left: 34px;
		position: absolute;
		/* background-color: white; */
	}

	h4 {
		margin-bottom: 2px;
	}

	select {
		margin-bottom: 1rem;
		font-size: 110%;
	}

	#test {
		width: 480px;
		height: 440px;
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
