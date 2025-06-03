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
	// const changeSelection = () => {
	// 	showModeSelector = !showModeSelector;
	// };
</script>

<div class="data-panel">
	{#if basinObject.isSelected}
		<div class="header">
			<div class="label">{basinObject.objectLabel}</div>
			<div class="typelabel">{basinObject.objectTypeLabel}</div>
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
		/* background-color: #60b9e9; */
		/* span {font-size: 3rem;} */
		padding: 10px;
		/* border-radius: 5px; */
		width: 100%;
		height: 100%;
		/* border: 1px solid #ccc; */
	}

	.header {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 3px;
		/* border: 1px solid salmon; */
		align-items: center;

		font-size: 18px;

		.label {
			font-size: 20px;
			font-weight: 600;
			/* color: #333; */
		}

		.typelabel {
			/* font-size: 18px; */
			/* font-variant: small-caps; */
			/* font-style: italic; */
			font-weight: 500;
			/* border: 1px solid #ccc; */
			padding: 7px;
			background-color: var(--stjoe-blue);
			color: white;
			margin-left: 6px;
			/* margin-right: 10px; */
			border-radius: 3px;
			/* color: var(--stjoe-green); */
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
