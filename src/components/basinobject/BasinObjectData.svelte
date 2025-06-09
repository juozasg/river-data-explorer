<script lang="ts">
	import { mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import SelectModeHint from "./SelectModeHint.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";
	import BasinObjectStats from "./stats/BasinObjectStats.svelte";

	type Props = { selectionTarget: "1" | "2"; basinObject: BasinObject };
	const { selectionTarget, basinObject }: Props = $props();
	let showModeSelector = $state(true);

	$effect(() => {
		if (basinObject.isSet) {
			showModeSelector = false;
		}
	});
</script>

<div class={`data-panel data-${selectionTarget}`}>
	{#if basinObject.isSet}
		<div class="header">
			<div class="label">
				{basinObject.objectLabelName}
				{#if basinObject.objectSiteId}
					<span class="site-id">({basinObject.objectSiteId})</span>
				{/if}
			</div>
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

	{#if (mapSelectionMode.mode !== "auto" && mapSelectionMode.target === selectionTarget) || (!basinObject.isSet && mapSelectionMode.target === selectionTarget)}
		<SelectModeHint />
	{/if}

	{#if showModeSelector}
		<SelectModeSelector target={selectionTarget} bind:show={showModeSelector} />
	{/if}

	{#if basinObject.isSet}
		<div class="basin-object-stats">
			<BasinObjectStats {basinObject} />
		</div>
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

		.site-id {
			font-size: 16px;
			font-weight: 400;
			color: var(--color-darkGrey);
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
	}

	.data-1 .object-type-pill {
		background-color: var(--color-data-1);
	}

	.data-2 .object-type-pill {
		background-color: var(--color-data-2);
	}

	.basin-object-stats {
		height: calc(100% - 20px);
		overflow: auto;
	}
</style>
