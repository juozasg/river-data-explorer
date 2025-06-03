<script lang="ts">
	import type { BasinObject } from "$src/appstate/selection/basinObjectSelection.svelte";
	import { mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import SelectModeHint from "./SelectModeHint.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";

	type Props = { selectionTarget: "1" | "2"; basinObject: BasinObject };
	const { selectionTarget, basinObject }: Props = $props();
	let showModeSelector = $state(true);

	$effect(() => {
		if (basinObject.isSelected) {
			showModeSelector = false;
		}
	});
</script>

<div class="data-panel">
	{#if basinObject.isSelected}
		<div class="header">
			<div class="label">{basinObject.objectLabel}</div>
			<div class="object-type-pill">{basinObject.objectTypeLabel}</div>
			{#if showModeSelector == false}
				<div class="controls">
					<div class="vbar"></div>
					<button onclick={() => (showModeSelector = true)}>Change</button>
				</div>
			{/if}
		</div>
	{:else}
		<div>
			<h4>Data {selectionTarget}: Nothing selected</h4>
		</div>
	{/if}

	{#if (mapSelectionMode.mode !== "auto" && mapSelectionMode.target === selectionTarget) || (
		!basinObject.isSelected && mapSelectionMode.target === selectionTarget)}
		<SelectModeHint />
	{/if}

	{#if showModeSelector}
		<SelectModeSelector target={selectionTarget} bind:show={showModeSelector} />
	{/if}
</div>

<style>
	.data-panel {
		padding: 10px;
		width: 100%;
		height: 100%;
	}

	.header {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 3px;
		align-items: center;

		font-size: 18px;

		.label {
			font-size: 20px;
			font-weight: 600;
		}
		button {
			font-size: 18px;
		}

		.controls {
			align-self: center;

			display: flex;
			flex-direction: row;
			justify-content: left;
			gap: 0px;

			.vbar {
				width: 1.5px;
				/* height: 100%; */
				height: 28px;
				background-color: var(--color-lightGrey);
				margin: 2px 8px 0 4px;
			}
		}
		/* overflow: scroll; */
		/* justify-content: space-between; */
		/* align-items: center; */
	}
</style>
