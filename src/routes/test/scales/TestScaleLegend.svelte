<script lang="ts">

	import * as d3sc from 'd3-scale-chromatic';
	import * as d3i from 'd3-interpolate';
	import * as d3s from 'd3-scale';

	let value = $state(0.5);
	const color = $derived(d3sc.interpolatePlasma(value));
	// dude.
	// d3ScaleChromatic.

	// d3sc.

	// d3.interpolateBlues(0.5);
	// console.log('TEST SCALES')
	// console.log(d3scale);

	// const scale = d3scale.scaleLinear()
	// 	.domain([0, 100])
	// 	.range([0, 600]);

	// 	console.log('SCALE', scale, scale(50), scale.in);

</script>

<input type="range" bind:value min="0" max="1" step="0.01" style="width:600px" />
<pre>{value}</pre>
<i>{color}</i>

<div id="panel" style="--color: {color}"></div>


<style>
	#panel {
		display: block;
		border: 2px solid plum;
		width: 600px;
		height: 300px;
		background-color: var(--color);
	}
</style>
