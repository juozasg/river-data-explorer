<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import MapLibreMap from './MapLibreMap.svelte';
	import type { MapLibreMapProps } from '$src/lib/types/components';

	import { addLayers } from '$src/lib/map/addDataHomePageMap';
	import { hoveredArea, selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { addSources } from '$src/lib/map/addDataMap';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	let hoveredFeature: ml.MapGeoJSONFeature | Site | null = $state(null);

	onMount(() => {
		console.log('HomePageMap onMount', divElement, mlMap, mlmComponent);
		const map = mlMap!;

		map.on('mousemove', (e) => {
			const features = map.queryRenderedFeatures(e.point).filter((f) => f.layer.id.match(/sjrbc-/));
			if (features.length) {
				// currently not hovering site
				if (hoveredFeature == null || 'properties' in hoveredFeature) {
					const riverHoverFeatures = features.filter((f) => f.layer.id.match(/river-hover/));
					if (riverHoverFeatures.length) {
						const riverHoverFeature = riverHoverFeatures[0];
						console.log('hovered river feature', { source: riverHoverFeature.source,
							id: riverHoverFeature.id }, riverHoverFeature)


						map.setFeatureState(
							{ source: riverHoverFeature.source,
								id: riverHoverFeature.id },
							{ hover: true }
						);
						hoveredFeature = riverHoverFeature;
					}
					const layerIds = riverHoverFeatures.map((f) => f.layer.id);
					// console.log('queryRenderedFeatures', layerIds, features);
				}
			}

			if(hoveredFeature) {
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
		hoveredFeature = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		// console.log('markermouse', site?.id, site);
		hoveredFeature = null;
	};

	function mapClick(point: ml.PointLike) {}

	const hoveredName = () => {
		if (hoveredFeature) {
			if ('properties' in hoveredFeature) {
				return hoveredFeature.properties.name;
			} else {
				return hoveredFeature.name;
			}
		}
		return '';
	};

	const idLabel = () => {
		if (hoveredFeature) {
			if ('properties' in hoveredFeature) {
				return 'ID';
			} else {
				return 'Site ID';
			}
		}
		return '';
	};
</script>

{#snippet tooltipContent()}
	<h5>{hoveredName() || ''}</h5>
	{#if hoveredFeature}
		<i>{idLabel()}: {hoveredFeature.id}</i>
		<!-- <p><b>{sites.inHuc10(hoveredArea.feature.id).length}</b> sites</p> -->
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
		<!-- class:site-hovered={siteHovered(site)} -->
		<div class="marker-box"></div>
	</div>
{/each}

<style>
	.marker {
		.marker-box {
			border: 1.5px solid #3b084b;
			border-radius: 5px;
			transform: rotateY(0deg) rotate(45deg);

			width: 10px;
			height: 10px;
			background-color: #8011a3aa;

			&:hover {
				background-color: #F8EBC0;
				width: 20px;
				height: 20px;
				border-radius: 10px;
			}
		}
	}
</style>
