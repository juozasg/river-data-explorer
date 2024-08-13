<!--
  @component
  Generates a tooltip that works on multiseries datasets, like multiline charts. It creates a tooltip showing the name of the series and the current value. It finds the nearest data point using the [QuadTree.html.svelte](https://layercake.graphics/components/QuadTree.html.svelte) component.
 -->
<script>
	// @ts-nocheck

	import { getContext, onMount } from 'svelte';
	import { format } from 'd3-format';

	import { findAncestor } from '$src/lib/utils';
	import QuadTree from './QuadTree.html.svelte';
	import { on } from 'svelte/events';

	const { data, width, yScale, zScale, config } = getContext('LayerCake');

	let tooltipElement;
	let layercakeContainer;

	let mouseX, mouseY;

	$: {
		if (tooltipElement && !layercakeContainer) {
			layercakeContainer = findAncestor(tooltipElement, 'layercake-container');
			layercakeContainer.addEventListener('mousemove', mousemove);
		}
	}

	function mousemove(event) {
		var rect = layercakeContainer.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}

	const commas = format(',');
	const titleCase = (d) => d.replace(/^\w/, (w) => w.toUpperCase());

	/** @type {Function} [formatTitle=d => d] - A function to format the tooltip title, which is `$config.x`. */
	export let formatTitle = (d) => d;

	/** @type {Function} [formatValue=(key, d) => isNaN(+d) ? d : commas(d)] - A function to format the value. */
	export let formatValue = (key, v) => (isNaN(+v) ? v : commas(v));

	/** @type {Function} [formatKey=d => titleCase(d)] - A function to format the series name. */
	export let formatKey = (d) => titleCase(d);

	/** @type {Number} [offset=-20] - A y-offset from the hover point, in pixels. */
	export let offset = -20;

	/** @type {Array<Object>|undefined} [dataset] - The dataset to work off of—defaults to $data if left unset. You can pass something custom in here in case you don't want to use the main data or it's in a strange format. */
	export let dataset = undefined;

	/** @type {Array<string>} [] - Display only the tooltip for the given variables. */
	export let filterKeys = [];

	const w = 220;
	const w2 = w / 2;

	let found = {};

	/* --------------------------------------------
	 * Sort the keys by the highest value
	 */
	/**
	 * @param {{ [x: string]: any; }} result
	 */
	function calcPositionsForData(result) {
		if (Object.keys(result).length === 0) return [];

		const rows = Object.keys(result)
			.filter((k) => k !== $config.x)
			.filter((k) => filterKeys.length === 0 || filterKeys.includes(k))
			.filter((k) => result[k] !== null && result[k] !== undefined)
			.map((key) => {
				const isY = key === $config.y;
				const isZ = key === $config.z;
				let top = isY ? $yScale(result[key]) : isZ ? $zScale(result[key]) : 100;
				const fromMouse = Math.abs((mouseY || 0) - top);
				if (top < 100) top = 120 + top;
				return {
					key,
					value: result[key],
					top,
					fromMouse
				};
			});
		// .sort((a, b) => a.fromMouse - b.fromMouse);

		return rows;
	}

	function getClosestToMouse(rows) {
		return [...rows].sort((a, b) => a.fromMouse - b.fromMouse)[0];
	}
</script>

<QuadTree dataset={dataset || $data} y="x" let:x let:y let:visible let:found let:e>
	{@const dataWithPositions = calcPositionsForData(found)}
	{#if visible === true}
		<div style="left:{x}px;" class="line"></div>
		{#if dataWithPositions.length > 0}
			<div
				class="tooltip"
				bind:this={tooltipElement}
				style="
        width:{w}px;
        display: {visible ? 'block' : 'none'};
        top:{getClosestToMouse(dataWithPositions).top + offset}px;
        left:{Math.min(Math.max(w2, x), $width - w2)}px;"
			>
				<div class="title">{formatTitle(found[$config.x])}</div>
				{#each dataWithPositions as row}
					<div class="row">
						<span class="key">{@html formatKey(row.key)}:</span>
						{formatValue(row.key, row.value)}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</QuadTree>

<style>
	.tooltip {
		position: absolute;
		font-size: 13px;
		pointer-events: none;
		border: 1px solid #ccc;
		background: rgba(255, 255, 255, 0.85);
		transform: translate(-50%, -100%);
		padding: 5px;
		z-index: 15;
		pointer-events: none;
	}
	.line {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		border-left: 1px dotted #666;
		pointer-events: none;
	}
	.tooltip,
	.line {
		transition:
			left 250ms ease-out,
			top 250ms ease-out;
	}
	.title {
		font-weight: bold;
		font-size: 10px;
		margin-bottom: 4px;
	}
	.row {
		line-height: 1.1;
	}

	.key {
		color: #999;
	}
</style>
