<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';

	import { addLayers } from '$src/lib/map/addDataAreasMap';
	import { hoveredArea, selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { sites, splitSiteId } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { addSources } from '$src/lib/map/addDataMap';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mapContainer: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

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
			// console.log('CLICK', selectedArea.feature, changed)
			if (selectedArea.feature && changed) {
				onSelected?.();
			}
		});
	});

	const makeMarker = (node: HTMLElement, site: Site) => {
		const map = mlMap!;
		const marker = new ml.Marker({ element: node })
			.setLngLat([site.lon, site.lat])
			.addTo(map);
		return {
			destroy() {
				marker.remove();
			}
		};
	};
</script>

<MapLibreMap
	bind:this={mapContainer}
	{addSources}
	{addLayers}
	bind:divElement
	bind:mlMap
	{...others}
/>

{#each sites.all as site}
	<div class="marker" use:makeMarker={site} class:area-hovered={hoveredArea.containsSite(site)}>
	</div>
{/each}

<style>
	.marker {
		/* position: absolute; */
		/* background-color: white; */
		border: 1px solid #222;

		/* margin: 2px; */
		/* display: flex; */
		/* flex-direction: column; */
		/* align-items: center; */
		width: 10px;
		height: 10px;
		background-color: rgb(226, 120, 255);


		/* .num { */
			/* font-size: 0.6em; */
		/* } */
	}

	.marker.area-hovered {
		background-color: rgb(255, 120, 120);
	}

</style>
