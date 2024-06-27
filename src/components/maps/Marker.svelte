<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';

	type Props = {
		map: ml.Map;
		markerMouseEnter: (e: MouseEvent, site: Site) => void;
		markerMouseLeave: (e: MouseEvent, site: Site) => void;
		site: Site;
		highlighted?: boolean;
	};

	let { map, markerMouseEnter, markerMouseLeave, site, highlighted }: Props = $props();

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, map, site);
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="marker"
	onmouseenter={(e) => markerMouseEnter(e, site)}
	onmouseleave={(e) => markerMouseLeave(e, site)}
	class:is-selected={site.id === selectedSite.site?.id}
	class:highlighted
	use:makeMarker={site}
>
	<div class="marker-box"></div>
</div>

<style>
	.marker {
		/* opacity: 0.8; */
		padding: 3px;
		.marker-box {
			border: 1px solid #3b084b;
			border-radius: 0px;
			transform: rotateY(0deg) rotate(45deg);

			width: 10px;
			height: 10px;
			background-color: #ebc0f8;
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
			/* background-color: #CDF8C0; */
			width: 15px;
			height: 15px;
			border-width: 2px;

			/* border-radius: 8px; */
		}
	}

	.marker.highlighted:hover {
		.marker-box {
			/* background-color: #CDF8C0; */
			width: 24px;
			height: 24px;
			border-radius: 12px;

			/* border-radius: 8px; */
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
			/* border-style: */
		}
	}
</style>
