<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { sites } from '$src/appstate/sites.svelte';
	import type { Site } from '$src/lib/types/site';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';

	type Props = {
		map: ml.Map;
		markerMouseEnter: (e: MouseEvent, site: Site) => void;
		markerMouseLeave: (e: MouseEvent, site: Site) => void;
		site: Site;
	}

	let { map, markerMouseEnter,  markerMouseLeave, site}: Props = $props();

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, map, site);
	};


</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="marker"
	onmouseenter={(e) => markerMouseEnter(e, site)}
	onmouseleave={(e) => markerMouseLeave(e, site)}
	use:makeMarker={site}
>
	<div class="marker-box"></div>
</div>


<style>
	.marker {
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
			background-color: #CDF8C0;
			width: 20px;
			height: 20px;
			border-radius: 10px;
		}
	}
</style>
