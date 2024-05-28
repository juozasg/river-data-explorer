<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';

	import { rebuildLayersHuc10, addSourceHuc10 } from '$src/lib/map/areasData';
	import { hoveredArea, selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	const loadData = async (map: ml.Map) => {
		await addSourceHuc10(map);
		rebuildLayersHuc10(map);
	};

	onMount(() => {
		console.log('AreaSelectorMap onMount', divElement, mlMap, mapContainer);
		const map = mlMap!;

		map.on('mousemove', 'huc10', (e) => {
			if (e!.features!.length > 0) {
				const feature = e.features![0];
				hoveredArea.update(map, feature);
			}
		});

		// When the mouse leaves the huc layer clear hover state
		map.on('mouseleave', 'huc10', () => {
			hoveredArea.clear(map);
		});

		map.on('click', (e) => {
			const feature = map.queryRenderedFeatures(e.point).filter((f) => f.layer.id === 'huc10')[0];
			const changed = selectedArea.update(map, feature ?? null);

			if(selectedArea.feature && changed) {
				onSelected?.();
			}
		});
	});

// TODO: markers
</script>

<MapLibreMap bind:this={mapContainer} {loadData} bind:divElement bind:mlMap {...others} />
