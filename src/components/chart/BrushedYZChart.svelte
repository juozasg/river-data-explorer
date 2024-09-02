<script lang="ts">
	import YZAxisLabels from './YZAxisLabels.svelte';

	import { scaleLinear } from 'd3-scale';
	import { Html, LayerCake, Svg } from 'layercake';

	import AxisX from '$src/components/chart/layercake/AxisX.svelte';
	import AxisY from '$src/components/chart/layercake/AxisY.svelte';
	import AxisYZRight from '$src/components/chart/layercake/AxisYZRight.svelte';
	import Brush from '$src/components/chart/layercake/Brush.html.svelte';
	import Line from '$src/components/chart/layercake/Line.svelte';
	import Scatter from '$src/components/chart/layercake/Scatter.svelte';
	import SharedTooltip from '$src/components/chart/layercake/SharedTooltip.svelte';
	import { isNumber } from '$src/lib/utils';
	import {
		formatChartDate,
		formatChartTTKey,
		formatChatTTValue,
		genXDateTicks,
		genYTicks
	} from '$src/lib/utils/chart';
	import type ColumnTable from 'arquero/dist/types/table/column-table';

	import { YZChartParams } from '$src/lib/utils/YZChartParams';
	import { chartYColor, chartZDarker, chartZColor } from '$src/lib/utils/colors';
	import type { Site } from '$src/lib/types/site';
	import type { RegionFeature } from '$src/appstate/data/features.svelte';

	type Props = {
		table: ColumnTable;
		yVar: string;
		zVar: string;
		chartWidth: number;
		chartHeight: number;
		site?: Site;
		region?: RegionFeature;
	};

	const { table, yVar, zVar, chartWidth, chartHeight, site, region }: Props = $props();

	const yParams = $derived(new YZChartParams('y', yVar, table));
	const zParams = $derived(new YZChartParams('z', zVar, table));

	const yAxisLabel = $derived(
		`${yParams.varLabel} <span class="location-label">${region?.name}<span>`
	);
	const zAxisLabel = $derived(
		`${zParams.varLabel} <span class="location-label">${site?.name}<span>`
	);

	let brushMinIndex: number | null = $state(null);
	let brushMaxIndex: number | null = $state(null);

	// brushedTable is full table sliced with min,max from the Brush component
	const brushedTable = $derived.by(() => {
		if (!table) return;
		const sliceIndex = isNumber(brushMaxIndex) ? brushMaxIndex! + 1 : undefined;

		return table?.slice(brushMinIndex || 0, sliceIndex);
	});

	$effect(() => {
		console.log('table', table.objects());
		console.log('brushedTable', brushedTable?.objects());
	});

	let brushedChartContainer = $state<HTMLElement>();
	let brushContainer: HTMLElement | null = $state(null);
	const xTickTextElements: NodeListOf<HTMLElement> | undefined = $derived(
		brushedChartContainer?.querySelectorAll('.x-axis .tick text')
	);

	const brushHoverOn = () => {
		brushContainer!.style.opacity = '1';
		xTickTextElements?.forEach((t) => (t.style.opacity = '0'));
	};

	const brushHoverOff = () => {
		brushContainer!.style.opacity = '0.1';
		xTickTextElements?.forEach((t) => (t.style.opacity = '1'));
	};
</script>

<!-- extra chart container nesting makes LayerCake happy -->
<div class="yz-chart-container" bind:this={brushedChartContainer as HTMLElement}>
	<div class="chart-container" style={`width: ${chartWidth}px; height: ${chartHeight - 52}px;`}>
		<!-- MAIN CHART -->
		<!-- brushedTable is full table sliced with min,max from the Brush component -->
		{#if brushedTable && brushedTable.numRows() > 0}
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
					<YZAxisLabels yLabel={yAxisLabel} zLabel={zAxisLabel} />
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
		{#if table && table.numRows() > 0}
			<LayerCake
				data={table.objects()}
				x="date"
				y={yVar}
				yDomain={yParams.domain}
				z={zVar}
				zDomain={zParams.domain}
				zScale={scaleLinear()}
				zRange={({ height }: any) => [height, 0]}
			>
				<Svg>
					{#if yParams.stats.count > 0}
						<Line stroke={chartYColor} />
						<Scatter
							r={yParams.radius - 1}
							fill={chartYColor}
							filterIndexRange={[brushMinIndex, brushMaxIndex]}
						/>
					{/if}
					{#if zParams.stats.count > 0 && zVar !== yVar}
						<Line stroke={chartZColor} dataSource="z" />
						<Scatter
							r={zParams.radius - 1}
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
	.yz-chart-container {
		width: 100%;
		height: 100%;
		overflow: visible;
		/* width: 480px; */
		/* height: 440px; */
		/* border: 1.5px dotted blue; */
		position: relative;

		.chart-container {
			/* border: 1px solid red; */
			/* margin-left: 2rem; */
			position: absolute;
			top: 24px;

			& :global {
				.x-axis .tick:nth-child(even) text {
					translate: 0px 18px;
				}

				.x-axis .tick:first-child text {
					translate: 12px 4px;
				}

				.x-axis .tick:last-child text {
					translate: -18px 0px;
				}
			}
			/*
		.chart-container :global(.x-axis .tick:nth-child(even) text) {
			translate: 0px 14px;
		} */
		}

		.brush-container {
			height: 22px;
			bottom: 0px;
			width: 100%;
			margin-left: 0px;
			position: absolute;
			cursor: col-resize;
		}
	}
</style>
