<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import TooltipVariableBrief from '../../tooltips/TooltipVariableBrief.svelte';
	import { chartYColor, chartZColor } from '$src/lib/utils/colors';

	interface Props extends HTMLAttributes<HTMLTableCellElement> {
		ySelected?: boolean;
		zSelected?: boolean;
		yHinted?: boolean;
		zHinted?: boolean;
		children: Snippet;
		varname: string;
		hoverColor?: string;
	}

	// type Props = any;

	let {
		children,
		varname,
		ySelected = false,
		zSelected = false,
		yHinted = false,
		zHinted = false,
		hoverColor = '#ccc',
		...attribs
	}: Props = $props();


	let finalHoverColor = $derived.by(() => {
		if(ySelected) return chartYColor + '33';
		if(zSelected) return chartZColor + '33';

		return hoverColor
	});

	let variableTooltip: TooltipVariableBrief | undefined = $state();
</script>


<TooltipVariableBrief bind:this={variableTooltip} />

<td
	style="--hover-color: {finalHoverColor}"
	{...attribs}
	class="variable-label"
	onmouseleave={(e: MouseEvent) => variableTooltip?.mouseLeaveVariable(e)}
	onmousemove={(e: MouseEvent) => variableTooltip?.mouseMoveVariable(e, varname)}
>
	<div class="flexblock">
		<div class="selection-hints">
			{#if ySelected}
				<div class="y-selection"></div>
			{/if}
			{#if zSelected}
				<div class="z-selection"></div>
			{/if}
			{#if yHinted && !ySelected}
				<div class="y-hint"></div>
			{/if}
			{#if zHinted && !zSelected}
				<div class="z-hint"></div>
			{/if}
		</div>

		<div class="text-block">{@render children()}</div>
	</div>
</td>

<style>
	.variable-label:hover {
		cursor: pointer;
		background-color: var(--hover-color, #ccc);
	}

	.variable-label {
		padding-left: 0 !important;
	}

	.flexblock {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
	}

	.text-block {
		position: relative;
		width: 100%;
	}

	.selection-hints {
		display: flex;
		height: auto;
		margin-right: 4px;
		padding-right: 1px;
		margin-left: -6px;

		pointer-events: none;
		/* border: 1px solid salmon; */

		.y-selection {
			background-color: #ab00d6;
			width: 6px;
			height: 100%;
		}

		.z-selection {
			background-color: #00d6ab;
			width: 6px;
			height: 100%;
		}

		.y-hint {
			border: 2px dashed #ab00d6;

			width: 6px;
			height: 100%;
		}

		.z-hint {
			border: 2px dashed #00d6ab;
			width: 6px;
			height: 100%;
		}
	}
</style>
