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

	import { findAncestor } from "$src/lib/utils";
	import { getContext, onMount } from "svelte";
	import HorizontalHoverLine from "./HorizontalHoverLine.svelte";
	import { varlabel, varstdmax, varstdmin, varunits } from "$src/lib/utils/varHelpers";

	type Props = {
		varname: string;
		color: string;
	};

	const { color, varname }: Props = $props();

	const min = $derived(varstdmin(varname));
	const max = $derived(varstdmax(varname));

	const maxLabel = $derived.by(() => {
		if (max) {
			return `${varlabel(varname)} safe maximum is ${max} ${varunits(varname)}`;
		}
		return "";
	});

	const { xScale, yScale }: { xScale: any; yScale: any } = getContext("LayerCake");

	const y = $derived($yScale(max));
	const x0 = $derived($xScale.range()[0]);
	const x1 = $derived($xScale.range()[1]);

	let maxPath = $state("");
	let minPath = $state("");

	let textWidth = $state(100);
</script>

{#if max}
	<HorizontalHoverLine {y}>
		{#snippet line()}
			<line x1={x0} y1={y} x2={x1} y2={y} stroke={color} stroke-width={1} stroke-dasharray={"5,5"}></line>
		{/snippet}
		{#snippet hoveredLine()}
			<g>
				<rect x={x0 + 32} y={y - 20} dy={-5} width={textWidth + 20} height="20" fill="white"></rect>

				<text x={x0 + 32} y={y - 5} fill={color} bind:clientWidth={textWidth}>{maxLabel}</text>
			</g> <line x1={x0} y1={y} x2={x1} y2={y} stroke={color} stroke-width={2} stroke-dasharray={"5,2"}></line>
		{/snippet}
	</HorizontalHoverLine>
{/if}

{#if min}
	<!-- <path class="path-line" d={minPath} {color}></path> -->
{/if}

<style>
</style>
