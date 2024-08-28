<script lang="ts">
	import * as ml from 'maplibre-gl';

	import type { Site } from '$src/lib/types/site';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';
	import { onMount } from 'svelte';
	import { ghost } from '$src/lib/utils/colors';

	type Props = {
		map: ml.Map;
		markerMouseEnter: (e: MouseEvent, site: Site) => void;
		markerMouseLeave: (e: MouseEvent, site: Site) => void;
		site: Site;
		emphasized?: boolean;
		selected?: boolean;
		selectedYVar?: boolean;
		selectedZVar?: boolean;
	};

	let {
		map,
		markerMouseEnter,
		markerMouseLeave,
		site,
		emphasized = false,
		selected = false,
		selectedYVar = false,
		selectedZVar = false
	}: Props = $props();

	let color = $state('yellowgreen');

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, map, site);
	};

	// @hmr:keep-all

	// onMount(() => {
	// 	console.log('mounted marker', site.id, color)
	// });

	$effect(() => {
		console.log('FX marker color1 ', color);
	});

	export const siteId = site.id;
	export const setColor = (c: string) => (color = c);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="marker"
	data-site-id={site.id}
	onmouseenter={(e) => markerMouseEnter(e, site)}
	onmouseleave={(e) => markerMouseLeave(e, site)}
	class:is-selected={selected}
	class:emphasized
	use:makeMarker={site}
>
	{#if selectedYVar}
		<div class="selected-y"></div>
	{/if}
	{#if selectedZVar}
		<div class="selected-z"></div>
	{/if}

	<div style="--color: {color}" class="marker-box" class:ghost={color == ghost}></div>
</div>

<style>
	.marker {
		padding: 3px;
		/* opacity: 0.5; */
		.marker-box {
			opacity: 1;
			border: 1px solid #3b084b;
			border-radius: 0px;
			transform: rotateY(0deg) rotate(45deg);

			width: 12.5px;
			height: 12.5px;
			background-color: var(--color);
		}

		.selected-y {
			z-index: 3;
			position: absolute;
			bottom: calc(50% - 6px);
			left: calc(-2px - 70%);
			width: 12px;
			height: 12px;
			background-color: #ab00d6;
			border: 2px solid #3b084b;
		}

		.selected-z {
			z-index: 3;
			position: absolute;
			bottom: calc(50% - 6px);
			right: calc(-2px - 70%);
			width: 12px;
			height: 12px;
			background-color: #00af8c;
			border: 2px solid #3b084b;
		}
		&:hover:not(.is-selected) {
			.selected-y {
				left: calc(2px - 70%);
				border-radius: 6px;
			}

			.selected-z {
				right: calc(2px - 70%);
				border-radius: 6px;

			}
		}

		&:hover.is-selected {
			.selected-y {
				left: calc(10px - 70%);
				border-radius: 6px;
			}

			.selected-z {
				right: calc(10px - 70%);
				border-radius: 6px;
			}
		}

		/*
		border-left: 8px solid #ab00d6;
			border-right: 8px solid #00d6ab; */
	}

	.marker .marker-box.ghost {
		opacity: 0.52;
		width: 10px;
		height: 10px;
	}

	.marker:has(.marker-box:not(.ghost)) {
		/* border: 4px solid #ba5cd6; */
		z-index: 1;
	}

	.marker:hover {
		padding: 0px;
		z-index: 3 !important;
		.marker-box {
			/* background-color: #cdf8c0; */
			/* position: relative; */
			width: 22px;
			height: 22px;
			border-radius: 11px;
			/* border-style: ridge; */
			border-width: 2px;
		}
	}

	.marker.is-selected:hover {
		/* border: 2px solid purple; */
		.marker-box {
			/* border-color: #cdf8c0; */
			width: 34px !important;
			height: 34px !important;
			border-radius: 17px !important;
			/* border-width: 2px !important; */
		}
	}

	.marker.is-selected {
		z-index: 4 !important;

		padding: 0px;
		padding-left: -4px;
		.marker-box {
			/* background-color: #ebc0f8; */
			width: 24px !important;
			height: 24px !important;
			/* border-radius: 12px; */

			border-width: 7px !important;
			border-style: double;
			/* transform: rotateY(0deg) rotate(0deg); */
		}
	}

	.marker.emphasized {
		.marker-box {
			width: 15px;
			height: 15px;
			border-width: 2px;
		}
	}

	.marker.emphasized:hover {
		.marker-box {
			width: 24px;
			height: 24px;
			border-radius: 12px;
		}
	}
</style>
