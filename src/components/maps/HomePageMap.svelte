<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';

	import { addLayers } from '$src/lib/data/map/homePageMapData';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { addSources } from '$src/lib/data/map/mapData';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import type { BBoxLike } from '$src/lib/types/basic';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	let hoveredRiver: ml.MapGeoJSONFeature | null = $state(null);
	let hoveredArea: ml.MapGeoJSONFeature | null = $state(null);
	let hoveredSite: Site | null = $state(null);

	onMount(() => {
		console.log('HomePageMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e) => {
			if (hoveredRiver) {
				map.setFeatureState({ source: hoveredRiver.source, id: hoveredRiver.id }, { hover: false });
				hoveredRiver = null;
			}

			if (hoveredArea) {
				map.setFeatureState({ source: hoveredArea.source, id: hoveredArea.id }, { hover: false });
				hoveredArea = null;
			}

			const hucHoverFeatures = map.queryRenderedFeatures(e.point, { layers: ['sjriver-huc10'] })
			if (hucHoverFeatures.length) {
				hoveredArea = hucHoverFeatures[0];
				map.setFeatureState({ source: hoveredArea.source, id: hoveredArea.id }, { hover: true });
			}

			const bbox: BBoxLike = [
				[e.point.x - 10, e.point.y - 10],
				[e.point.x + 10, e.point.y + 10]
			];

			const riverHoverFeatures = map.queryRenderedFeatures(bbox, { layers: ['sjriver-river'] });

			if (riverHoverFeatures.length) {
				hoveredRiver = riverHoverFeatures[0];

				map.setFeatureState({ source: hoveredRiver.source, id: hoveredRiver.id }, { hover: true });
			}

			if (hoveredRiver || hoveredSite || hoveredArea) {
				mlmComponent.showTooltip(e.point.x, e.point.y);
			} else {
				mlmComponent.hideTooltip();
			}
		});
	});

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, mlMap!, site);
	};

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		// console.log('markermouse', site?.id, site);
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		// console.log('markermouse', site?.id, site);
		hoveredSite = null;
	};

	function mapClick(point: ml.PointLike) {}
</script>

{#snippet tooltipContent()}
	{#if hoveredArea}
		<h5>Watershed: {hoveredArea?.properties.name || ''}</h5>
		<i>HUC10: {hoveredArea.id}</i>
	{/if}
	{#if hoveredRiver}
		<h5 class="river">River: {hoveredRiver?.properties.name || ''}</h5>
		<!-- <i>ID: {hoveredRiver.id}</i> -->
	{/if}
	{#if hoveredSite}
		<h5 class="site">Site: {hoveredSite.name || ''}</h5>
		<i>Site ID: {hoveredSite.id}</i>
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

<!-- {#each sites.all as site} -->
{#each sites.all as site}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="marker"
		onmouseenter={(e) => markerMouseEnter(e, site)}
		onmouseleave={(e) => markerMouseLeave(e, site)}
		use:makeMarker={site}
	>
		<div class="marker-box"></div>
	</div>
{/each}

<style>
	h5 {
		margin-bottom: 2px;
	}

	h5.site, h5.river {
		border-top: 1px solid #ccc;
		padding-top: 5px;
		margin-top: 5px;
	}

	.marker {
		padding: 3px;
		.marker-box {
			border: 1px solid #3b084b;
			border-radius: 0px;
			transform: rotateY(0deg) rotate(45deg);

			width: 10px;
			height: 10px;
			background-color: #ebc0f8;

			&:hover {
				background-color: #ebc0f8;
				width: 20px;
				height: 20px;
				border-radius: 10px;
			}
		}
	}

	.marker:hover {
		.marker-box {
			background-color: #CDF8C0;
			width: 20px;
			height: 20px;
			border-radius: 10px;
		}
	}
</style>
