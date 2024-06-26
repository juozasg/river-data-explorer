<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';

	import { addLayers } from '$src/lib/data/map/areasMapData';
	import { HoveredFeatureState, selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { addSources } from '$src/lib/data/map/mapData';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import Marker from './Marker.svelte';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();
	const hoveredArea = new HoveredFeatureState();


	onMount(() => {
		console.log('AreaSelectorMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', 'sjriver-huc10', (e) => {
			hoveredArea.mouseMove(e, ['sjriver-huc10']);

			if(hoveredArea.feature) {
				mlmComponent.showTooltip(e.point.x, e.point.y);
			} else {
				console.log('hide tooltip')
				mlmComponent.hideTooltip();
			}
		});

		map.on('click', (e) => mapClick(e.point));
	});

	// setTimeout(() => {
	// 	try {
	// 		if(window && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
	// 			console.log('LOCALHOST DEBUGGING');
	// 			console.log('timeout click');
	// 			mapClick([379, 207.5546875]);
	// 		}
	// 	} catch (e) {
	// 		console.error('timeout click error', e);
	// 	}
	// }, 1000);

	// const siteHovered = (site: Site) => hoveredArea.containsSite(site);

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, mlMap!, site);
	};

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		console.log('markerMouseEnter', site?.id, site);
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		// console.log('markermouse', site?.id, site);
	};

	function mapClick(point: ml.PointLike) {
		const map = mlMap!;
		console.log(point);
		const feature = map.queryRenderedFeatures(point, {layers: ['sjriver-huc10']})[0];
		const changed = selectedArea.update(map, feature ?? null);
		// console.log('CLICK', selectedArea.feature, changed)
		if( changed) {
			sites.selectInHuc10(selectedArea?.feature?.id as string | undefined);
			onSelected?.();
			console.log('SELECTED', selectedArea?.feature?.id, sites.inHuc10(selectedArea?.feature?.id));
		}
	}
</script>

{#snippet tooltipContent()}
	<h5>{hoveredArea.feature?.properties?.name || ''}</h5>
	{#if hoveredArea.feature}
		<i>huc10: {hoveredArea.feature.id}</i>
		<p><b>{sites.inHuc10(hoveredArea.feature.id).length}</b> sites</p>
	{/if}
{/snippet}

<MapLibreMap
	bind:this={mlmComponent}
	{addSources}
	{addLayers}
	{tooltipContent}
	bind:divElement
	bind:mlMap
	{...others}
/>


{#if mlMap}
	{#each sites.all as site}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} />
	{/each}
{/if}

<style>
</style>
