<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { onMount } from 'svelte';
	import MapLibreMap from './MapLibreMap.svelte';
	let { ...others } = $props();

	// setting these to state means can write effects whenever and use `if (!mlMap) return;`
	// setting these to regular variables mean we know they are true inside onMount
	// but in effects were have to check if they are true and make sure to read other inputs (like selected style)
	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	onMount(() => {
		console.log('AreaSelectorMap onMount', divElement, mlMap, mapContainer.$$slot_def);

		// mlMap.on('clicked') // select area; scroll view
	});

	// implement section/hover logic
	// decide what we want
	// no events. use callback props or $host rune
</script>

<MapLibreMap bind:this={mapContainer} bind:divElement bind:mlMap {...others} />
