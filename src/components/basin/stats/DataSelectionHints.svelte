<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLTableCellElement> {
		ySelected?: boolean;
		zSelected?: boolean;
		yHinted?: boolean;
		zHinted?: boolean;
	}

	let { ySelected = false, zSelected = false, yHinted = false, zHinted = false }: Props = $props();
</script>

<div class="selection-hints">
	{#if ySelected}
		<div class="y-selection"></div>
	{/if}
	{#if yHinted && !ySelected}
		<div class="y-hint"></div>
	{/if}
	{#if zSelected}
		<div class="z-selection"></div>
	{/if}
	{#if zHinted && !zSelected}
		<div class="z-hint"></div>
	{/if}
</div>

<style>
	.selection-hints {
		display: flex;
		height: auto;
		margin-right: 4px;
		padding-right: 1px;
		margin-left: -6px;

		pointer-events: none;

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
