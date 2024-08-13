<script lang="ts">
  import YZAxisLabels from './YZAxisLabels.svelte';

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
	import { aremove, fmtDate, isNumber } from '$src/lib/utils';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import {
		chartYColor,
		chartZColor,
		chartZDarker,
		formatChartDate,
		formatChartTTKey,
		formatChatTTValue,
		genXDateTicks,
		genYTicks
	} from '$src/lib/utils/chart';

	import { YZChartParams } from '$src/lib/utils/YZChartParams';
	import ChartDataSelector from './ChartDataSelector.svelte';

	let tableName = $state('sjrbc-1');

	let yVar: string = $state('bod');
	let zVar: string = $state('bodPercent');

	const table: ColumnTable | undefined = $derived(sitesTables.get(tableName)?.reify());

	const yParams = $derived(new YZChartParams('y', yVar, table));
	const zParams = $derived(new YZChartParams('z', zVar, table));

	let brushMinIndex: number | null = $state(null);
	let brushMaxIndex: number | null = $state(null);

	const brushedTable = $derived.by(() => {
		if (!table) return;
		const sliceIndex = isNumber(brushMaxIndex) ? brushMaxIndex! + 1 : undefined;

		// const sliceIndex =
		// 	brushMaxIndex == null
		// 		? undefined
		// 		: brushMaxIndex >= table.numRows() - 1
		// 			? undefined
		// 			: brushMaxIndex + 1;

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

	const points = $derived(table?.objects() || []);
	const brushedPoints = $derived(brushedTable?.objects() || []);

	let brushedChartContainer: HTMLElement | null = $state(null);
	let brushContainer: HTMLElement | null = $state(null);

	const xTickTextElements = () =>
		(brushedChartContainer?.querySelectorAll('.x-axis .tick text') as NodeListOf<HTMLElement>) ||
		([] as HTMLElement[]);

	const brushHoverOn = () => {
		brushContainer!.style.opacity = '1';

		xTickTextElements().forEach((t) => (t.style.opacity = '0'));
	};

	const brushHoverOff = () => {
		brushContainer!.style.opacity = '0.1';
		xTickTextElements().forEach((t) => (t.style.opacity = '0'));
	};
</script>

<ChartDataSelector {table} {yVar} {zVar} bind:tableName />

<div id="test" bind:this={brushedChartContainer}>
	<h2>TestCharts</h2>

	<div class="chart-container">
		<!-- MAIN CHART -->
		{#if brushedTable && brushedPoints.length > 0}
			<LayerCake
				data={brushedTable.objects()}
				x="date"
				y={yVar}
				yDomain={yParams.domain}
				z={zVar}
				zDomain={zParams.domain}
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
					{#if yParams.stats.count > 0}
						<AxisY
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(yParams.domain, ts)}
							color={chartYColor}
						/>

						<Line stroke={chartYColor} />
						<Scatter r={yParams.radius} fill={chartYColor} />
					{/if}
					{#if zParams.stats.count > 0 && zVar !== yVar}
						<AxisYZRight
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(zParams.domain, ts)}
							color={chartZDarker}
						/>
						<Line stroke={chartZColor} dataSource="z" />
						<Scatter r={zParams.radius} fill={chartZColor} dataSource="z" />
					{/if}
				</Svg>
				<Html>
					<SharedTooltip
						formatTitle={formatChartDate}
						formatKey={(k: string) => formatChartTTKey(k, yVar, zVar)}
						formatValue={formatChatTTValue}
						filterKeys={[yVar, zVar]}
					/>
					<YZAxisLabels yLabel={yParams.varLabel} zLabel={zParams.varLabel}/>
				</Html>
			</LayerCake>
		{/if}
	</div>

	<!-- BRUSH CHART -->
	<div
		class="brush-container"
		style="opacity:0.1"
		onmouseenter={brushHoverOn}
		onmouseleave={brushHoverOff}
		ontouchmove={brushHoverOn}
		ontouchmovecapture={brushHoverOn}
		bind:this={brushContainer}
	>
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
