<!--
  @component
  Generates an SVG scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
	import { getContext } from 'svelte';

	const { data, xGet, yGet, zGet, xScale, yScale, zScale } = getContext('LayerCake');

	/** @type {String} [ySource="y"] - "y" or "z" for data values */
	export let dataSource = 'y';
	$: dataGet = dataSource === 'y' ? $yGet : $zGet;
	$: dataBandwidth = dataSource === 'y' ? $yScale.bandwidth : $zScale.bandwidth;

	/** @type {Number} [r=5] – The circle's radius. */
	export let r = 5;

	/** @type {String} [fill='#0cf'] – The circle's fill color. */
	export let fill = '#0cf';

	/** @type {String} [stroke='#000'] – The circle's stroke color. */
	export let stroke = '#000';

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
			{#if typeof dataGet(d) == 'number' && typeof $xGet(d) == 'number'}
				<circle
					cx={$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}
					cy={dataGet(d) + (dataBandwidth ? dataBandwidth() / 2 : 0)}
					{r}
					{fill}
					{stroke}
					stroke-width={strokeWidth}
				/>
			{/if}
		{/if}
	{/each}
</g>
