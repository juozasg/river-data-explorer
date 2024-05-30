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

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	// let tooltipElement: HTMLDivElement | undefined = $state();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	onMount(() => {
		console.log('AreaSelectorMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', 'huc10', (e) => {
			if (e!.features!.length > 0) {
				const feature = e.features![0];
				hoveredArea.update(map, feature);
				mlmComponent.showTooltip(e.point.x, e.point.y);
			}
		});

		// When the mouse leaves the huc layer clear hover state
		map.on('mouseleave', 'huc10', (e) => {
			// console.log('huc10 mouseleave', e);
			const features = map.queryRenderedFeatures(e.point);
			const huc10 = features.find((f) => f.source === 'huc10');
			if (huc10 && hoveredArea.feature?.id === huc10.id) {
				// didn't leave feature, only hovered on a marker
				return;
			}

			hoveredArea.clear(map);
			mlmComponent.hideTooltip();
		});

		map.on('click', (e) => mapClick(e.point));
	});

	setTimeout(() => {
		try {
			if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
				console.log('LOCALHOST DEBUGGING');
				console.log('timeout click');
				mapClick([379, 207.5546875]);
			}
		} catch (e) {
			console.error('timeout click error', e);
		}
	}, 1000);

	const siteHovered = (site: Site) => hoveredArea.containsSite(site);

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, mlMap!, site);
	};

	const markermouse = (e: MouseEvent, site: Site) => {
		console.log('markermouse', site?.id, site);
	};

	function mapClick(point: ml.PointLike) {
		console.log(point);
		if (!mlMap) return;
		const feature = mlMap!.queryRenderedFeatures(point).filter((f) => f.layer.id === 'huc10')[0];
		const changed = selectedArea.update(mlMap!, feature ?? null);
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

{#each sites.all as site}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="marker"
		onmouseenter={(e) => markermouse(e, site)}
		use:makeMarker={site}
		class:area-hovered={siteHovered(site)}
	></div>
{/each}

<style>
	.marker {
		border: 1px solid #222;

		width: 10px;
		height: 10px;
		background-color: rgb(226, 120, 255);
		pointer-events: auto;
	}

	.marker.area-hovered {
		background-color: rgb(255, 120, 120);
	}
</style>
