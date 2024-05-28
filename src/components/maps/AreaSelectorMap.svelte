<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import { addLayersHuc10, addSourceHuc10 } from '$lib/map/controllers/areasData';
	import MapLibreMap from './MapLibreMap.svelte';

	let { ...others } = $props();

	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	const loadData = async (map: ml.Map) => {
		await addSourceHuc10(map);
		addLayersHuc10(map);
	};

	onMount(() => {
		console.log('AreaSelectorMap onMount', divElement, mlMap, mapContainer);
		// mlMap.on('clicked') // select area; scroll view
	});
</script>

<MapLibreMap bind:this={mapContainer} {loadData} bind:divElement bind:mlMap {...others} />




