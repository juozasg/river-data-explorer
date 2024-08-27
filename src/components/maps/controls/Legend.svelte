<script lang="ts">
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
		import { varmax, varmin, varunits } from '$src/lib/utils/varHelpers';
	import { interpolateVarDataURL } from '$src/lib/utils/colors';
	import { onMount } from 'svelte';
	import ElementResizeObserver from '$src/components/website/ElementResizeObserver.svelte';

	const { varname }: { varname: string } = $props();

	let doc: Document | undefined = $state();
	onMount(() => {
		doc = document;
	});

	const dataUrl = $derived(doc && interpolateVarDataURL(doc, varname));
	const maxLegendTextWidth = $derived.by(() => {
		const maxValueNumChars = varmax(varname).toString().length;
		const unitNumChars = varunits(varname).length;
		const padding = 10;
		return padding + (maxValueNumChars + unitNumChars + 1) * 6;
	});

	let legendControl = $state<HTMLDivElement>();
	let legendWidth = $state(0);
	let legendRect = $state<DOMRectReadOnly>();

	// const

</script>

<pre style="position: fixed; top: 0; left:0; z-index: 100001">
	max legend text width: {maxLegendTextWidth}
	legendWidth: {legendWidth}
	rect: {JSON.stringify(legendRect)}
</pre>

<div class="map-control" bind:this={legendControl}>
	<ElementResizeObserver element={legendControl} bind:width={legendWidth} bind:contentRect={legendRect}/>
	<div class="button legend">
		<img class="legend-bar" src={dataUrl} />

		<div class='legend-labels'>
			<span>{varmin(varname)}{varunits(varname)}</span>
			<span>{varmax(varname)}{varunits(varname)}</span>
		</div>
	</div>
</div>

<style>
	.map-control {

		position: absolute;
		top: 10px;
		right: 0;
		width: calc(100% - 300px);
		/* width: 100px; */

		z-index: 1000;

		.button {
			padding: 0;
			margin-right: 1rem;
			padding-left: 1rem;
			padding-right: 1rem;
			position: relative;
			display: block !important;
		}

		.legend-labels {
			/* display: flex; */
			/* justify-content: space-between; */
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			/* bottom: -1.5rem; */
			font-size: 0.8rem;
			/* color: var(--color-text); */
		}
	}
	.legend-bar {
		display: block;
		height: 10px;
		width: calc(100% - 2rem);
		/* margin-right: 2rem; */
		position: absolute;
		bottom: 6px;
		/* bottom: -7px; */
		/* width: var(--width, 100%); */
	}
</style>
