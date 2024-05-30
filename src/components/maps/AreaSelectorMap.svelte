<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';

	import { addLayers } from '$src/lib/map/addDataAreasMap';
	import { hoveredArea, selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { addSources } from '$src/lib/map/addDataMap';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import { createPopupWorkaround } from '$src/lib/utils/createPopupWorkaround';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	// const tooltipPopup: ml.Popup = createPopupWorkaround();
	let tooltip: HTMLDivElement | undefined = $state();


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

				if(tooltip) {
					tooltip.style.display = 'block';
					tooltip.style.left = e.point.x + 'px';
					tooltip.style.top = e.point.y - 30 + 'px';
				}
			} else {
				console.log('++mousemove huc10', 'no features')
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

	$effect(() => {
		// console.log('NOFX', hoveredArea.feature?.id)
		// console.log(sites.all.map((site) => site.huc10));
		// sites.selected = sites.all.filter((site) => site.huc10 === hoveredArea.feature?.id);
		if(hoveredArea.feature?.id) {
			// console.log('hovered CHANGED', hoveredArea.feature.id, Date.now())
			// sites.selectInHuc10(hoveredArea.feature.id as string);
			// hoveredArea.redrawTooltip(mlMap!);
		}
		// console.log('inArea', inArea);
	});

	const siteHovered = (site: Site) => hoveredArea.containsSite(site)

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, mlMap!, site);
	};

	const markermouse = (site: Site) => {
		console.log('markermouse', site?.id, site);
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

{#if hoveredArea.feature}
	<div bind:this={tooltip} class="hover-tooltip" style="position: absolute; z-index: 10; pointer-events: none;">
		<h5>{hoveredArea.feature.properties?.name}</h5>
		<p><b>{sites.inHuc10(hoveredArea.feature.id).length}</b> sites</p>
	</div>
{/if}

{#each sites.all as site}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="marker"
		onmouseenter={() => markermouse(site)}
		use:makeMarker={site}
		class:area-hovered={siteHovered(site)}
	></div>
{/each}

<style>
	.hover-tooltip {
		background-color: white;
		border: 1px solid #222;
		padding: 5px;
		font-size: 80%;

		position: absolute;
		/* display: block; */
		top: -200px;
		z-index: 1000;
	}

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
