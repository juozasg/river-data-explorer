<script lang="ts">
	import * as ml from 'maplibre-gl';

	import type { Site } from '$src/lib/types/site';
	import { makeSiteMarker } from '$src/lib/utils/maplibre';
	import { ghost } from '$src/lib/utils/colors';

	type Props = {
		map: ml.Map;
		markerMouseEnter: (e: MouseEvent, site: Site) => void;
		markerMouseLeave: (e: MouseEvent, site: Site) => void;
		site: Site;
		emphasized?: boolean;
		selected?: boolean;
		isYVar?: boolean;
		isZVar?: boolean;
	};

	let {
		map,
		markerMouseEnter,
		markerMouseLeave,
		site,
		emphasized = false,
		selected = false,
		isYVar = false,
		isZVar = false
	}: Props = $props();

	let color = $state('yellowgreen');
	export const isGhost = () => color == ghost;

	const makeMarker = (node: HTMLElement, site: Site) => {
		return makeSiteMarker(node, map, site);
	};

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
	{#if isYVar}
		<div class="y-var-site"></div>
	{/if}
	{#if isZVar}
		<div class="z-var-site"></div>
	{/if}

	<div style="--color: {color}" class="marker-box" class:ghost={isGhost()}></div>
</div>

<style>
	.marker {
		.marker-box {
			opacity: 1;
			border: 1px solid #3b084b;
			border-radius: 0px;
			transform: rotateY(0deg) rotate(45deg);

			width: 12.5px;
			height: 12.5px;
			background-color: var(--color);
		}

		&:has(.y-var-site, .z-var-site) {
			z-index: 5 !important;
		}
	}
	.marker .y-var-site {
		position: absolute;
		bottom: calc(50% - 2.5px);
		left: calc(-9px - 70%);
		width: 18px;
		height: 6px;
		background-color: #ab00d6;
		border: 1px solid #4b084b;
		border-right: none;
	}

	.marker .z-var-site {
		position: absolute;
		bottom: calc(50% - 2.5px);
		right: calc(-9px - 70%);
		width: 18px;
		height: 6px;
		background-color: #00d6ab;
		border: 1px solid #3b084b;
		border-left: none;
	}

	.marker.is-selected {
		.y-var-site {
				left: calc(2px - 70%);
			}

			.z-var-site {
				right: calc(2px - 70%);
			}
	}

	.marker {
		&:hover:not(.is-selected) {
			.y-var-site {
				left: calc(0px - 70%);
			}

			.z-var-site {
				right: calc(0px - 70%);
			}
		}

		&:hover.is-selected {
			.y-var-site {
				left: calc(10px - 70%);
			}

			.z-var-site {
				right: calc(10px - 70%);
			}
		}
	}

	.marker .marker-box.ghost {
		opacity: 0.52;
		width: 10px;
		height: 10px;
	}


	.marker:has(.marker-box:not(.ghost)) {
		z-index: 1;
	}

	.marker:hover {
		padding: 0px;
		z-index: 3 !important;
		.marker-box {
			width: 22px;
			height: 22px;
			border-radius: 11px;
			border-width: 2px;
		}
	}

	.marker.is-selected:hover {
		.marker-box {
			width: 34px !important;
			height: 34px !important;
			border-radius: 17px !important;
		}
	}

	.marker.is-selected {
		z-index: 4 !important;

		padding: 0px;
		padding-left: -4px;
		.marker-box {
			width: 24px !important;
			height: 24px !important;

			border-width: 7px !important;
			border-style: double;
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
