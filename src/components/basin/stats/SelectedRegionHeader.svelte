<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { regionEqual, type RegionFeature } from "$src/appstate/data/features.svelte";
	import { regionIdLabel } from "$src/lib/utils/regions";
	import InlineBlockIconify from "../../icons/InlineBlockIconify.svelte";

	type Props = {
		regionFeature: RegionFeature;
		dataSelection?: DataSelectionState;
		onClickClose?: () => void;
	};

	const { regionFeature, onClickClose, dataSelection }: Props = $props();

	const ySelected = $derived(
		dataSelection && regionFeature && dataSelection.yRegion && regionEqual(dataSelection.yRegion, regionFeature)
	);
	const zSelected = $derived(
		dataSelection && regionFeature && dataSelection.zRegion && regionEqual(dataSelection.zRegion, regionFeature)
	);

	const maxWidth = 300;
</script>

<div class="selected-details">
	<div class="label">
		{#if dataSelection}
			<div class="selection-hints">
				{#if ySelected}
					<div class="y-selection"></div>
				{/if}
				{#if zSelected}
					<div class="z-selection"></div>
				{/if}
			</div>
		{/if}

		<div class="pill">{regionFeature.regionType}</div>
		<strong>{regionFeature.name}</strong>
		<small>{regionIdLabel(regionFeature)} {regionFeature.id}</small>
	</div>
	<div class="close" onclick={onClickClose}><InlineBlockIconify icon="lets-icons:close-ring" size="2rem" /></div>
</div>

<style>
	.selection-hints {
		height: 20px;
		display: inline-block;
		position: relative;
		bottom: -3px;

		pointer-events: none;

		.y-selection {
			display: inline-block;
			background-color: #ab00d6;
			width: 6px;
			height: 100%;
		}

		.z-selection {
			display: inline-block;

			background-color: #00d6ab;
			width: 6px;
			height: 100%;
		}
	}

	.pill {
		display: inline;
	}


	.selected-details {
		display: flex;
		.label {
			flex-basis: content;
			text-align: right;
			padding-right: 0;
			padding-left: 1rem;
			margin-right: 0;
			line-height: 32px;

			justify-content: right;
			gap: 2px;

			strong {
				font-size: 1.2rem;
			}
		}

		.close {
			margin-left: 0.3rem;
			:global(path) {
				stroke: var(--font-color);
			}
		}
		.close:hover {
			cursor: pointer;
			/* background-color: var(--color-hover); */
			:global(path) {
				stroke: var(--color-primary);
			}
		}
	}

</style>
