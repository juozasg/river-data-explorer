<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';
	import { addDataHuc10 } from '$src/lib/map/addDataSitesMap';

	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { fitFeatureBounds } from '$src/lib/utils/maplibre';

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
		console.log('FX siteselector', mlMap, selectedArea.feature, mlMap?.loaded());

		if (!mlMap) return;
		if (!mlMap.loaded()) return;
		const map = mlMap!;

		console.log('FX set data!');
		const t = Date.now();


		map.querySourceFeatures('huc10').forEach((feature) => {
			map.setFeatureState({ source: 'huc10', id: feature.id }, { selected: false });
		});

		if (selectedArea.feature) {
			const dt = Date.now() - t;
			console.log('FX set sitesarea selected', selectedArea.id);
			console.log('dt', dt);

			map.setFeatureState({ source: 'huc10', id: selectedArea.feature.id }, { selected: true });
			fitFeatureBounds(map, selectedArea.feature);
		}
	});
</script>

<MapLibreMap bind:this={mapContainer} loadData={addDataHuc10} bind:divElement bind:mlMap {...others} />
