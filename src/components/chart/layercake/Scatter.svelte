<!--
  @component
  Generates an SVG scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
	import { isNumber } from "$src/lib/utils";
import { getContext } from "svelte";

	const { data, xGet, yGet, zGet, y, z, xScale, yScale, zScale } = getContext("LayerCake");

	/** @type {String} [ySource="y"] - "y" or "z" for data values */
	export let dataSource = "y";
	$: dataGet = dataSource === "y" ? $yGet : $zGet;
	$: dataBandwidth = dataSource === "y" ? $yScale.bandwidth : $zScale.bandwidth;
	$: value = dataSource === "y" ? $y : $z;

	/** @type {Number|null} [min=null] – Standard value min. Highlight in red */
	export let min = null;

	/** @type {Number|null} [min=null] – Standard value max. Highlight in red */
	export let max = null;


	export let badcolor = "red";
	/** @type {Number} [r=5] – The circle's radius. */
	export let r = 5;

	/** @type {String} [fill='#0cf'] – The circle's fill color. */
	export let fill = "#0cf";

	/** @type {String} [stroke='#000'] – The circle's stroke color. */
	export let stroke = "#000";

	/** @type {Number} [strokeWidth=0] – The circle's stroke width. */
	export let strokeWidth = 0;

	/** @type {Array<number|null>} [filterIndexes=[null,null]] – Skip points outside [min, max] index range */
	export let filterIndexRange = [null, null];

	$: filterMinIndex = filterIndexRange[0];
	$: filterMaxIndex = filterIndexRange[1];
	// $: {
	// 	console.log('Scatter updated', $data);

	// 	const allData = $data.map(d => [d, $xGet(d), dataGet(d)]);
	// 	console.log('Scatter allData', allData);
	// }
</script>

<g class="scatter-group">
	{#each $data as d, i}
		{#if (filterMinIndex == null || i >= filterMinIndex) && (filterMaxIndex == null || i <= filterMaxIndex)}
			{#if typeof dataGet(d) == "number" && typeof $xGet(d) == "number"}
				{@const cx = $xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
				{@const cy = dataGet(d) + (dataBandwidth ? dataBandwidth() / 2 : 0)}

				<!-- {#if (min != null && dataGet(d) < min) || (max != null && dataGet(d) > max)} -->
				{#if (typeof max == 'number' && value(d) > max) || (typeof min == 'number' && value(d) < min)}
					<circle {cx} {cy} r={r+1} fill="none" stroke={badcolor} stroke-width={strokeWidth + 2} />
				{/if}
				<circle {cx} {cy} {r} {fill} {stroke} stroke-width={strokeWidth} />
			{/if}
		{/if}
	{/each}
</g>
