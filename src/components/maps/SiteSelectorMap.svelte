<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import type { MapLibreMapProps } from '$lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';
	import { addLayers } from '$src/lib/map/addDataSitesMap';

	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';
	import { fitFeatureBounds, makeSiteMarker, setFeatureState } from '$src/lib/utils/maplibre';
	import { addSources } from '$src/lib/map/addDataMap';
	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';

	// type Props = {
	// 	onSelected?: () => void;
	// } & Partial<MapLibreMapProps>;

	let { ...others }: Partial<MapLibreMapProps> = $props();

	let mlmComponent: MapLibreMap;
	let divElement: HTMLDivElement | undefined = $state();
	let mlMap: ml.Map | undefined = $state();

	let hoveredSite: Site | undefined = $state();
	let tooltip: HTMLDivElement | undefined = $state();

	onMount(() => {
		console.log('SiteSelectorMap onMount', divElement, mlMap, mlmComponent);
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

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, mlMap!, site);
	};

	const mouseEnterMarker = (e: MouseEvent, site: Site) => {
		const rect = divElement?.getClientRects()[0];
		const [x, y] = [e.clientX - (rect!.left || 0), e.clientY - (rect!.top || 0)];

		// console.log(x, y)
		mlmComponent.showTooltip(x + 2, y - 38);
		hoveredSite = site;
	};

	const mouseLeaveMarker = (e: MouseEvent, site: Site) => {
		hoveredSite = undefined;
		mlmComponent.hideTooltip();

	};
</script>


{#snippet tooltipContent()}
		<h5>{hoveredSite?.name || ''}</h5>
		<p>{hoveredSite?.id || ''}</p>
		<p>{hoveredSite?.id || ''}</p>
		<p>{hoveredSite?.id || ''}</p>
		<p>{hoveredSite?.id || ''}</p>
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


{#each sites.selected as site (site.id)}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="marker"
		onmouseenter={(e) => mouseEnterMarker(e, site)}
		onmouseleave={(e) => mouseLeaveMarker(e, site)}
		use:makeMarker={site}
	>
		<div class="marker-box"></div>
	</div>
{/each}


<style>
	.marker {
		.marker-box {
			border: 1px solid #5c2f60;
			border-radius: 3px;
			transform: rotateY(0deg) rotate(45deg);

			width: 16px;
			height: 16px;
			background-color: rgba(90, 20, 110, 0.5);
		}
	}

</style>
