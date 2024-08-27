<script lang="ts">
	import * as ml from 'maplibre-gl';

	import type { Site } from '$src/lib/types/site';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';
	import { onMount } from 'svelte';

	type Props = {
		map: ml.Map;
		markerMouseEnter: (e: MouseEvent, site: Site) => void;
		markerMouseLeave: (e: MouseEvent, site: Site) => void;
		site: Site;
		highlighted?: boolean;
		color?: string;
	};

	let { map, markerMouseEnter, markerMouseLeave, site, highlighted, color = 'green'}: Props = $props();

	// const red = $derived(site.dataset === 'usgs');
	const red = false;

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, map, site);
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="marker"
	data-site-id={site.id}
	onmouseenter={(e) => markerMouseEnter(e, site)}
	onmouseleave={(e) => markerMouseLeave(e, site)}
	class:is-selected={site.id === selectedSite.site?.id}
	class:highlighted
	class:red
	use:makeMarker={site}
	style="--color: {color};"
>
	<div class="marker-box"></div>
</div>

<style>
	.marker {
		padding: 3px;
		.marker-box {
			opacity: 1;
			border: 1px solid #3b084b;
			border-radius: 0px;
			transform: rotateY(0deg) rotate(45deg);

			width: 12px;
			height: 12px;
			background-color: var(--color);
		}
	}

	:global(.marker.ghost) {
		.marker-box {
			opacity: 0.5;
			width: 10px;
			height: 10px;
		}
	}

	.marker:hover {
		.marker-box {
			background-color: #cdf8c0;
			width: 20px;
			height: 20px;
			border-radius: 10px;
		}
	}

	.marker.is-selected:hover {
		.marker-box {
			border-color: #cdf8c0;
			border-width: 4px;
			width: 22px;
			height: 22px;
			border-radius: 11px;
		}
	}

	.marker.highlighted {
		.marker-box {
			width: 15px;
			height: 15px;
			border-width: 2px;

		}
	}

	.marker.red {
		.marker-box {
			width: 15px;
			height: 15px;
			border-width: 2px;
			background-color: red;

		}
	}

	.marker.highlighted:hover {
		.marker-box {
			width: 24px;
			height: 24px;
			border-radius: 12px;
		}
	}

	.marker.is-selected {
		.marker-box {
			background-color: #ebc0f8;
			width: 24px;
			height: 24px;
			border-radius: 12px;

			border-color: #cdf8c0;
			border-width: 4px;
		}
	}
</style>
