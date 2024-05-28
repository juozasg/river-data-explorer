<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';
	import { addSourceHuc10, rebuildLayersHuc10 } from '$lib/map/sitesData';

	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';

	// type Props = {
	// 	onSelected?: () => void;
	// } & Partial<MapLibreMapProps>;

	let { ...others }: Partial<MapLibreMapProps> = $props();

	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	const loadData = async (map: ml.Map) => {
		await addSourceHuc10(map);
		rebuildLayersHuc10(map);
	};

	onMount(() => {
		console.log('SiteSelectorMap onMount', divElement, mlMap, mapContainer);
	});

	$effect(() => {
		if (!mlMap) return;
		if (!mlMap._fullyLoaded) return;

		// clear out feature-state
		rebuildLayersHuc10(mlMap);

		if (selectedArea.feature) {
			// console.log('set', feature.id)

			mlMap.setFeatureState({ source: 'sites-huc10', id: selectedArea.feature.id }, { selected: true });

			const geometry = selectedArea.feature.geometry as any;
			const coordinates: ml.LngLatLike[] = geometry.coordinates[0];

			console.log('zoomies', geometry, coordinates);

			// Pass the first coordinates in the LineString to `lngLatBounds` &
			// wrap each coordinate pair in `extend` to include them in the bounds
			// result. A variation of this technique could be applied to zooming
			// to the bounds of multiple Points or Polygon geomteries - it just
			// requires wrapping all the coordinates with the extend method.
			const bounds = coordinates.reduce(
				(bounds, coord) => {
					return bounds.extend(coord);
				},
				new ml.LngLatBounds(coordinates[0], coordinates[0])
			);

			mlMap.fitBounds(bounds, {
				padding: 20
			});
		}
	});
</script>

<MapLibreMap bind:this={mapContainer} {loadData} bind:divElement bind:mlMap {...others} />
