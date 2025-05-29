<script lang="ts">
	import { mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import { basinObjectTypePluralLabel } from "$src/lib/utils/prettyNames";
	// let show = $state(true);

	const typeLabel = $derived(basinObjectTypePluralLabel(mapSelectionMode.mode));
</script>

<div class="select-mode-hint">
	{#if mapSelectionMode.mode !== "auto"}
		Click <span class="type-label">{typeLabel}</span> on the map to select
	{:else}
		Click <span class="type-label">Sites</span> or <span class="type-label">Rivers</span> on the map to select
	{/if}
</div>


<style>
	.select-mode-hint {
		margin: 6px;
		margin-left: 0;
		border: 2px dashed var(--stjoe-blue);
		border-radius: 4px;
		font-style: italic;
		font-weight: 500;
		padding: 4px;
		width: fit-content;
		.type-label {
			font-weight: 600;
			color: var(--stjoe-blue);
		}
	}
</style>