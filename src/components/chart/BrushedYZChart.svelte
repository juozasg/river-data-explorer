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
	import ChartTooltip from '$src/components/chart/layercake/ChartTooltip.svelte';
	import { fmtDateDMonY, isNumber, UTCDayDate } from '$src/lib/utils';
	import {
		formatChartDate,
		formatChartTTKey,
		formatChatTTValue,
		genXDateTicks,
		genYTicks
	} from '$src/lib/utils/chart';
	import type ColumnTable from 'arquero/dist/types/table/column-table';

	import type { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';
	import { YZChartParams } from '$src/lib/utils/YZChartParams';
	import { chartYColor, chartZColor, chartZDarker } from '$src/lib/utils/colors';

	type Props = {
		yzTable: ColumnTable;
		yParams: YZChartParams;
		zParams: YZChartParams;

		chartWidth: number;
		chartHeight: number;
		onDateSelected?: (d: Date) => void;
	};

	const { yzTable, yParams, zParams, chartWidth, chartHeight, onDateSelected }: Props = $props();


	const yAxisLabel = $derived(
		`${yParams.varLabel} <span class="location-label">${yParams.locationName}<span>`
	);
	const zAxisLabel = $derived(
		`${zParams.varLabel} <span class="location-label">${zParams.locationName || ''}<span>`
	);

	let brushMinIndex: number | null = $state(null);
	let brushMaxIndex: number | null = $state(null);

	// brushedTable is full table sliced with min,max from the Brush component
	const brushedTable = $derived.by(() => {
		const sliceIndex = isNumber(brushMaxIndex) ? brushMaxIndex! + 1 : undefined;

		return yzTable.slice(brushMinIndex || 0, sliceIndex);
	});

	// $effect(() => {
	// 	console.log('table', table.objects());
	// 	console.log('brushedTable', brushedTable?.objects());
	// });

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

	// HACKY indeed
	let dateHovered = $state<Date>();
	const formatTooltipTitle = (d: number) => {
		const date = UTCDayDate(d);
		if (dateHovered?.valueOf() !== date.valueOf()) {
			dateHovered = date;
		}
		return fmtDateDMonY(date);
	};

	function chartOnclick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if(target.hasAttribute('role') && target.getAttribute('role') === 'tooltip') {
			if(onDateSelected && dateHovered) onDateSelected(dateHovered);
		}
	}
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
				y="y"
				yDomain={yParams.domain}
				z="z"
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
					{#if yParams.stats.count > 0 && yParams.domain}
						<AxisY
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(yParams.domain!, ts)}
							color={chartYColor}
						/>

						<Line stroke={chartYColor} />
						<Scatter r={yParams.radius} fill={chartYColor} />
					{/if}
					{#if zParams.stats.count > 0 && zParams.domain}
						<AxisYZRight
							gridlines={false}
							tickMarks={true}
							ticks={(ts: number[]) => genYTicks(zParams.domain!, ts)}
							color={chartZDarker}
						/>
						<Line stroke={chartZColor} dataSource="z" />
						<Scatter r={zParams.radius} fill={chartZColor} dataSource="z" />
					{/if}
				</Svg>
				<Html>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<div onclick={chartOnclick} role="tooltip">
						<ChartTooltip
							formatTitle={formatTooltipTitle}
							formatKey={(k: string) => formatChartTTKey(k)}
							formatValue={formatChatTTValue}
							filterKeys={['y', 'z']}
						/>
						<YZAxisLabels yLabel={yAxisLabel} zLabel={zAxisLabel} />
					</div>
				</Html>
			</LayerCake>
		{/if}
	</div>

	<!-- BRUSH CHART -->
	<div
		role="figure"
		class="brush-container"
		style="opacity:0.1"
		onmouseenter={brushHoverOn}
		onmouseleave={brushHoverOff}
		ontouchmove={brushHoverOn}
		ontouchmovecapture={brushHoverOn}
		bind:this={brushContainer}
	>
			<LayerCake
				data={yzTable.objects()}
				x="date"
				y="y"
				yDomain={yParams.domain}
				z="z"
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
					{#if zParams.stats.count > 0}
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
	</div>
</div>

<style>
	.yz-chart-container {
		width: 100%;
		height: 100%;
		overflow: visible;

		position: relative;

		.chart-container {
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
