<script lang="ts">
	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import { chartYSelection, chartZSelection } from "$src/appstate/selection/objectDataSelections.svelte";

	type Props = { selectionTarget: "1" | "2"; basinObject: BasinObject; showModeSelector: boolean };
	let { selectionTarget, basinObject, showModeSelector = $bindable() }: Props = $props();


	$effect(() => {
		console.log('BasinObjectHeader basinObject:', basinObject);
		console.log('BasinObjectHeader chartZSelection:', chartZSelection.basinObject);

	});
</script>

<div class={`header data-${selectionTarget}`}>
	<div class="label">
		<div class="selection-hints">
			{#if basinObject.equals(chartYSelection.basinObject)}
				<div class="y-selection"></div>
			{/if}
			{#if basinObject.equals(chartZSelection.basinObject)}
				<div class="z-selection"></div>
			{/if}
		</div>
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

<style>
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

		.selection-hints {
			display: inline-flex;
			height: auto;
			width: auto;
			height: 16px;
			/* align-self: flex-start; */

			.y-selection {
				background-color: var(--color-chart-y);
				width: 6px;
				height: 100%;
				margin-right: 2px;
			}

			.z-selection {
				background-color:var(--color-chart-z);
				width: 6px;
				height: 100%;
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
