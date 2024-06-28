<script lang="ts">
	import { toggleHideTooltips } from '$src/appstate/ui/tooltips.svelte';

	let {
		tooltipContent,
	}: any = $props();

	let tooltip: HTMLDivElement | undefined = $state();
	let lastMouseLocation: { x: number; y: number } | undefined;

	$effect(() => {
		if(toggleHideTooltips.hide == true) {
			hideTooltip();
		} else {
			if(lastMouseLocation) showTooltip(lastMouseLocation.x, lastMouseLocation.y);
		}
	});

	// map div top corner = (0,0)
	export const showTooltip = (x: number, y: number) => {
		lastMouseLocation = { x, y };
		if(tooltip && !toggleHideTooltips.hide) {
			const containerHeight = tooltip.parentElement?.clientHeight || 0;

			tooltip.style.display = 'block';
			tooltip.style.left = x + 6 + 'px';
			tooltip.style.bottom = (containerHeight - y + 12) + 'px';
		}
	};

	export const hideTooltip = () => {
		if(tooltip) {
			tooltip.style.display = 'none';
		}
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
		padding-bottom: 1.5rem;
		font-size: 80%;
		min-width: 200px;

		/* opacity: 1; */
		position: absolute;
		display: none;
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

	:global(.hover-tooltip h5) {
		margin-bottom: 3px;
	}

	:global(h5.tooltip-section) {
		border-top: 1px solid #ccc;
		padding-top: 5px;
		margin-top: 5px;
	}
</style>
