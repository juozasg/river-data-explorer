<script lang="ts">
	import { toggleHideTooltips } from '$src/appstate/ui/tooltips.svelte';
	import type { Snippet } from 'svelte';

	let {
		tooltipContent,
	}: any = $props();

	let tooltip: HTMLDivElement | undefined = $state();
	// let lastMouseLocation: { x: number; y: number } | undefined;


	// map div top corner = (0,0)
	export const showTooltip = (x: number, y: number) => {
		// console.log('showTooltip', x, y);
		// lastMouseLocation = { x, y };
		if(tooltip) {
			const containerHeight = tooltip.clientHeight || 0;

			// console.log('containerHeight', containerHeight);
			// const containerHeight = 0;

			tooltip.style.display = 'block';
			// tooltip.style.left = x + 6 + 'px';
			tooltip.style.top = (y - containerHeight - 12) + 'px';
			tooltip.style.left = x + 'px';
			// tooltip.style.top = y + 'px';
			// console.log('top', tooltip.style.top);
		}
	};

	export const hideTooltip = () => {
		if(tooltip) {
			tooltip.style.display = 'none';
		}
	};

	// let content = $state('a<b>a</b>a');
	let content: Snippet | undefined = $state();
	export const setContent = (c: any) => {
		content = c;
	};
</script>



<div bind:this={tooltip} class="hover-tooltip" style="pointer-events: none;">
	<!-- {@render tooltipContent()} -->
	 {#if content}
		{@render content()}
	 {/if}
</div>

<style>
	.hover-tooltip {
		background-color: white;
		border: 1px solid #222;
		padding: 5px;
		padding-bottom: 1.5rem;
		font-size: 80%;
		min-width: 200px;
		max-width: 300px;
		max-height: 400px;

		/* opacity: 1; */
		position: fixed;
		/* height: 100px; */

		top: 0px;
		left: 400px;
		display: none;
		z-index: 1005;
		background: rgba(255, 255, 255, 0.85);

		/* transition:
			top 10ms ease normal,
			bottom 10ms ease normal; */
	}


	:global(.hover-tooltip h5) {
		margin-bottom: 3px;
	}

	:global(.hover-tooltip p) {
		margin-top: 0px !important;
		margin-bottom: 0px !important;
	}

	:global(h5.tooltip-section) {
		border-top: 1px solid #ccc;
		padding-top: 5px;
		margin-top: 5px;
	}
</style>
