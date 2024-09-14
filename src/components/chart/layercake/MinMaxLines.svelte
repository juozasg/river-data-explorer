<script lang="ts">
	// $xScale.range() = [0,555]
	// $yScale.range() = [448, 0]
	// $yScale.domain() = [0, 151214]
	// $yScale((151200) = 0.04 //px from the top

	// $effect(() => {
	// console.log('xScale', $xScale.range(), $xScale.domain());
	// console.log('yScale',   $yScale.range(), $yScale.domain(), $yScale);

	// console.log('min', min, 'max', max, 'y', y);
	// });

	import { varlabel, varunits } from "$src/lib/utils/varHelpers";
	import type { YZChartParams } from "$src/lib/utils/YZChartParams";
	import { getContext } from "svelte";
	import HorizontalHoverLine from "./HorizontalHoverLine.svelte";

	type Props = {
		varParams: YZChartParams;
		color: string;
	};

	const { color, varParams }: Props = $props();

	console.log("varParams", varParams);

	const min = $derived(varParams.stdmin);
	const max = $derived(varParams.stdmax);

	const maxLabel = $derived.by(() => {
		if (max) {
			return `${varlabel(varParams.varname)} safe maximum = ${max} ${varunits(varParams.varname)}`;
		}
		return "";
	});

	const minLabel = $derived.by(() => {
		if (min) {
			return `${varlabel(varParams.varname)} safe minimum = ${min} ${varunits(varParams.varname)}`;
		}
		return "";
	});

	const { xScale, yScale, zScale }: { xScale: any; yScale: any; zScale: any } = getContext("LayerCake");

	const valueScale = $derived(varParams.axis === "z" ? $zScale : $yScale);

	const yMax = $derived(valueScale(max));
	const yMin = $derived(valueScale(min));
	const x0 = $derived($xScale.range()[0]);
	const x1 = $derived($xScale.range()[1]);

	let maxLabelBoxsize = $state();
	let minLabelBoxsize = $state();

	// thanks firefox!
	const maxLabelBoxsizeWidth = $derived.by(() => {
		if (maxLabelBoxsize) {
			const resizeObserverSize = (maxLabelBoxsize as any)?.[0] as ResizeObserverSize | undefined;
			return (resizeObserverSize?.inlineSize || -6) + 6;
		}
		return 0;
	});
	const minLabelBoxsizeWidth = $derived.by(() => {
		if (minLabelBoxsize) {
			const resizeObserverSize = (minLabelBoxsize as any)?.[0] as ResizeObserverSize | undefined;
			return (resizeObserverSize?.inlineSize || -6) + 6;
		}
		return 0;
	});

	$effect(() => {
		console.log("boxsize", maxLabelBoxsize);
	});
</script>

{#if max}
	<HorizontalHoverLine y={yMax}>
		{#snippet line()}
			<line x1={x0} y1={yMax} x2={x1} y2={yMax} stroke={color} stroke-width={1} stroke-dasharray={"5,5"}></line>
		{/snippet}
		{#snippet hoveredLine()}
			<g style="fill:#eee">
				<rect x={x0 + 32} y={yMax - 20} width={maxLabelBoxsizeWidth} height="20"></rect>
				<text x={x0 + 36} y={yMax - 5} fill={color} bind:contentBoxSize={maxLabelBoxsize}>{maxLabel}</text>
			</g>
			<line x1={x0} y1={yMax} x2={x1} y2={yMax} stroke={color} stroke-width={2} stroke-dasharray={"5,2"}></line>
		{/snippet}
	</HorizontalHoverLine>
{/if}

{#if min}
	<HorizontalHoverLine y={yMin}>
		{#snippet line()}
			<line x1={x0} y1={yMin} x2={x1} y2={yMin} stroke={color} stroke-width={1} stroke-dasharray={"5,5"}></line>
		{/snippet}
		{#snippet hoveredLine()}
			<g style="fill:#eee">
				<rect x={x0 + 32} y={yMin - 20} width={minLabelBoxsizeWidth} height="20"></rect>

				<text x={x0 + 36} y={yMin - 5} fill={color} bind:contentBoxSize={minLabelBoxsize}>{minLabel}</text>
			</g>
			<line x1={x0} y1={yMin} x2={x1} y2={yMin} stroke={color} stroke-width={2} stroke-dasharray={"5,2"}></line>
		{/snippet}
	</HorizontalHoverLine>
{/if}
