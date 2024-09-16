<script lang="ts">
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import type { Snippet } from 'svelte';

	let tooltipElement: HTMLDivElement | undefined = $state();
	let showToggleHint = $state(false);

	let toggleable = $state(false);

	export const isToggleable = () => {
		return toggleable;
	}

	// map div top corner = (0,0)
	export const show = (x: number, y: number, _toggleable = false) => {
		if(_toggleable == false) {
			showToggleHint = false;
			tooltip.toggledHidden = false;
		} else {
			showToggleHint = true;
		}

		toggleable = _toggleable;

		if(tooltip?.toggledHidden || !content) {
			hide();
			return;
		}

		if(tooltipElement) {
			const containerHeight = tooltipElement.clientHeight || 0;
			const containerWidth = tooltipElement.clientWidth || 0;
			// prevents tooltip jumping/flashing if this code runs before clientRect is available
			if(containerHeight == 0) {
				tooltipElement.style.opacity = "0";
			} else {
				tooltipElement.style.opacity = "1";
			}

			tooltipElement.style.display = 'block';
			// tooltip.style.left = x + 6 + 'px';
			let top = y - containerHeight - 12;

			if(top < 0) {
				top = y + 12;
			}

			if(x + 10 + containerWidth > window.innerWidth) {
				x = window.innerWidth - containerWidth - 10;
				// const diff = x + containerWidth - window.innerWidth;
				// x -= diff;
			}
			tooltipElement.style.top = top + 'px';
			tooltipElement.style.left = x + 'px';
			// tooltip.style.top = y + 'px';
			// console.log('top', tooltip.style.top);
		}
	};

	export const hide = () => {
		if(tooltipElement) {
			tooltipElement.style.display = 'none';
		}
	};

	// let content = $state('a<b>a</b>a');
	let content: Snippet | undefined = $state();
	export const setContentSnippet = (c: Snippet) => {
		content = c;
	};
</script>



<div bind:this={tooltipElement} class="hover-tooltip" style="pointer-events: none;">
	<!-- {@render tooltipContent()} -->
	 {#if content}
		{@render content()}
		{#if showToggleHint}
			<span class="hint"><i><kbd>C</kbd> to copy <kbd>T</kbd> to hide</i></span>
		{/if}
	 {/if}
</div>

<style>
	.hover-tooltip {
		background-color: white;
		border: 1px solid #222;
		border-radius: var(--border-radius);
		padding: 5px;
		padding-top: 1px;
		/* padding-bottom: 1.5rem; */
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

		filter: drop-shadow(3px 3px 4px #00000046);
	}


	:global(.hover-tooltip h5) {
		margin-bottom: 3px;
	}

	:global(.hover-tooltip p) {
		margin-top: 0px !important;
		margin-bottom: 0px !important;
		padding: 2px 1px !important;
	}



	:global(h5.tooltip-section) {
		border-top: 1px solid #ccc;
		padding-top: 5px;
		margin-top: 5px;
	}

	.hint {
		display: block;
		/* position: absolute;	 */
		/* bottom: 2px; */
		/* right: 6px; */
		font-size: 0.8rem;
		text-align: right;
		margin-top: 5px;

		kbd {
			font-size: 0.7rem;
			font-family: monospace;
		}
	}
</style>
