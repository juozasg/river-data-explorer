<script lang="ts">
	import { interpolateVarDataURL } from '$src/lib/utils/colors';
	import { onMount } from 'svelte';

	const { varname }: { varname: string } = $props();

	let doc: Document | undefined = $state();
	onMount(() => {
		doc = document;
	});

	const dataUrl = $derived(doc && interpolateVarDataURL(doc, varname));
</script>

<div class="map-control">
	<img class="legend-bar" src={dataUrl} />
</div>

<style>
	.map-control {
		position: absolute;
		top: 0;
		right: 0;
		width: calc(100% - 300px);
		/* width: 100px; */

		z-index: 1000;
	}
	.legend-bar {
		display: block;
		height: 10px;
		width: 100%;
		/* width: var(--width, 100%); */

		/* width: 50px;
		height: 10px;
		img {
			display: block;
			width: 100%;
			height: 10px;
		} */
	}
</style>
