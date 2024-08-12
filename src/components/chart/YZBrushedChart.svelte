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
	import { aremove, fmtDate } from '$src/lib/utils';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { chartYColor, chartZColor, chartZDarker, formatChartDate, formatChartTTKey, formatChatTTValue, genXDateTicks, genYTicks, YZChartParams } from '$src/lib/utils/chart';
	import ChartDataSelector from './ChartDataSelector.svelte';

	let tableName = $state('sjrbc-1');

	let yVar: string = $state('bod');
	let zVar: string = $state('bodPercent');

	const table: ColumnTable | undefined = $derived(
		sitesTables
			.get(tableName)
			?.reify()
	);

	const yParams = $derived(table && yVar && new YZChartParams('y', yVar, table));
	const zParams = $derived(table && zVar && new YZChartParams('z', zVar, table));


	let brushMinIndex: number | null = $state(null);
	let brushMaxIndex: number | null = $state(null);


	const brushedTable = $derived.by(() => {
		if (!table) return;

		const sliceIndex =
			brushMaxIndex == null
				? undefined
				: brushMaxIndex >= table.numRows() - 1
					? undefined
					: brushMaxIndex + 1;

		// console.log('slicing fullTable', brushMinIndex, sliceIndex);
		return table?.slice(brushMinIndex || 0, sliceIndex);
	});



	$effect(() => {
		console.log('tableName', tableName);
		console.log('yVar', yVar);
		console.log('zVar', zVar);
		console.log('yParams', yParams);
		console.log('zParams', zParams);
	});





	const points = $derived(brushedTable?.objects() || []);

	const fullPoints = $derived(table?.objects() || []);

	const tooltipPoints = $derived.by(() => {
		const tooltipCols = ['date'];
		if (yParams && yParams.stats.count > 0) tooltipCols.push(yVar);
		if (zParams && zParams.stats.count > 0) tooltipCols.push(zVar);

		return brushedTable?.select(tooltipCols).objects() || [];
	});


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

<div>
aaa
<ChartDataSelector
	{table}
	{yVar}
	{zVar}
	bind:tableName
	/>

	TABLENAME:
	{tableName}

</div>
<!--

<div id="test" bind:this={testElement}>
	<h2>TestCharts</h2>

	<div class="chart-container">
		{#if brushedTable && points.length > 0}
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
				<Svg>
					<AxisX
						tickMarks={true}
						snapLabels={false}
						format={formatChartDate}
						ticks={(ts: number[]) => genXDateTicks(brushedTable, ts)}
					/>
					{#if yStats.count > 0}
						<AxisY
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(yDomain[0], yDomain[1], ts)}
							color={chartYColor}
						/>

						<Line stroke={chartYColor} />
						<Scatter r={yRadius} fill={chartYColor} />
					{/if}
					{#if zStats.count > 0 && zVar !== yVar}
						<AxisYZRight
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(zDomain[0], zDomain[1], ts)}
							color={chartZDarker}
						/>
						<Line stroke={chartZColor} dataSource="z" />
						<Scatter r={zRadius} fill={chartZColor} dataSource="z" />
					{/if}
				</Svg>
				<Html>
					<SharedTooltip
						formatTitle={formatChartDate}
						dataset={tooltipPoints}
						formatKey={(k: string) => formatChartTTKey(k, yVar, zVar)}
						formatValue={formatChatTTValue}
					/>
					<div class="y-labels" style="font-weight: bold; font-size: 0.9rem; display:flex; justify-content: space-between">
						<div class="y-axis-label y-label" style="color:{chartYColor};margin-left: 0.2rem">
							{yVarlabel}
						</div>
						<div class="z-axis-label y-label" style="color:{chartZDarker}; margin-right: 0.1rem; text-align: right">
							{zVarlabel}
						</div>
					</div>
				</Html>
			</LayerCake>
		{/if}
	</div>

	<div
		class="brush-container"
		style="opacity:0.1"
		onmouseenter={brushOn}
		onmouseleave={brushOff}
		ontouchmove={brushOn}
		ontouchmovecapture={brushOn}
		bind:this={brushContainer}
	>
		{#if brushedTable && fullPoints.length > 0}
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
						<Line stroke={chartYColor} />
						<Scatter
							r={yRadius - 1}
							fill={chartYColor}
							filterIndexRange={[brushMinIndex, brushMaxIndex]}
						/>
					{/if}
					{#if zStats.count > 0 && zVar !== yVar}
						<Line stroke={chartZColor} dataSource="z" ’ />
						<Scatter
							r={zRadius - 1}
							fill={chartZColor}
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
-->
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
