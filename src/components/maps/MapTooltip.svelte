<script lang="ts">
	import * as maptilersdk from '@maptiler/sdk';

	import { formatLngLat } from '$lib/copyLngLat';
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { listenMouseMoveCoordinates } from '$src/lib/map/mouseMoveCoordinates';
	import type { MapLibreMapProps } from '$src/lib/types/components';
	import { flushSync, onMount } from 'svelte';
	import LayerSwitcher from './LayerSwitcher.svelte';
	import { toggleRiverLayerVisibility } from '$src/lib/map/addDataMap';
	import { toggleoffAttribution } from '$src/lib/utils/maplibre';

	let {
		tooltipContent
	}: any = $props();


	let tooltip: HTMLDivElement | undefined = $state();

	// map div top corner = (0,0)
	export const showTooltip = (x: number, y: number) => {
		setTimeout(() => {
			if (tooltip) {
				flushSync(); // get rect

				const ttHeight = tooltip?.getClientRects()[0]?.height || 0;

				tooltip.style.opacity = '1';
				tooltip.style.left = x + 'px';
				tooltip.style.top = y - 12 - ttHeight + 'px';
				// console.log('ttHeight', ttHeight, 'style.top', tooltip.style.top);
			}
		}, 0);
	};

	export const hideTooltip = () => {
		setTimeout(() => {
			if (tooltip) {
				// 	tooltip.style.display = 'none';
				tooltip.style.opacity = '0';
				tooltip.style.left = '-9999px'; // hide it offscreen
			}
		}, 0);
	};
</script>



	<div bind:this={tooltip} class="hover-tooltip" style="position: absolute; pointer-events: none;">
		{@render tooltipContent()}
	</div>

<style>

	.hover-tooltip {
		background-color: white;
		border: 1px solid #222;
		padding: 5px;
		font-size: 80%;

		opacity: 0;
		position: absolute;
		z-index: 1001;
	}
</style>
