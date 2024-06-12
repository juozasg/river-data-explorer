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
	import { toggleHideTooltips } from '$src/appstate/ui/tooltips.svelte';

	let {
		tooltipContent
	}: any = $props();


	let tooltip: HTMLDivElement | undefined = $state();
	let lastMouseLocation = { x: 0, y: 0 };

	$effect(() => {
		if (toggleHideTooltips.hide == true) {
			 hideTooltip();
		} else {
			showTooltip(lastMouseLocation.x, lastMouseLocation.y);
		}
	});

	// map div top corner = (0,0)
	export const showTooltip = (x: number, y: number) => {
		lastMouseLocation = { x, y };
		setTimeout(() => {
			if(tooltip && !toggleHideTooltips.hide) {
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
		<span class="hint"><i><kbd>T</kbd> to hide</i></span>
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

	.hint {
		display: inline-block;
		position: absolute;
		bottom: 2px;
		right: 6px;
		font-size: 12px;
		text-align: right;

		kbd {
			font-size: 12px;
		}
	}
</style>
