<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';
	import { addLayers } from '$src/lib/map/addDataSitesMap';

	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { fitFeatureBounds, setFeatureState } from '$src/lib/utils/maplibre';
	import { addSources } from '$src/lib/map/addDataMap';

	// type Props = {
	// 	onSelected?: () => void;
	// } & Partial<MapLibreMapProps>;

	let { ...others }: Partial<MapLibreMapProps> = $props();

	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	onMount(() => {
		console.log('SiteSelectorMap onMount', divElement, mlMap, mapContainer);
	});

	$effect(() => {
		selectedArea.feature;
		console.log('FX TESTTEST siteselector', mlMap, mlMap?.loaded());
		if (!mlMap) return;
		const map = mlMap!;


		map.querySourceFeatures('huc10').forEach((feature) => {
			setFeatureState(map, 'huc10', feature.id, { selected: false });
		});

		if (selectedArea.feature) {
			setFeatureState(map, 'huc10', selectedArea.feature.id, { selected: true });
			fitFeatureBounds(map, selectedArea.feature);
		}
	});
</script>

<MapLibreMap bind:this={mapContainer} {addSources} {addLayers} bind:divElement bind:mlMap {...others} />
