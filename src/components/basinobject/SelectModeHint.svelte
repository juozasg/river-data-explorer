<script lang="ts">
	import { mapSelectionMode } from "$src/appstate/selection/objectDataSelections.svelte";
	import { selectModeTypePluralLabel } from "$src/lib/utils/prettyNames";
</script>

<div class="select-mode-hint">
	<div class="line"></div>
	<div class="line"></div>
	<div class="line"></div>
	<div class="line"></div>
	<div class="line"></div>
	<div class="line"></div>

	{#if mapSelectionMode.mode !== "auto"}
		Click <span class="type-label">{selectModeTypePluralLabel(mapSelectionMode.mode)}</span> on the map to select
	{:else}
		Click <span class="type-label">Sites</span> or <span class="type-label">Rivers</span> on the map to select
	{/if}
</div>

<style>

	@keyframes border-pulsate {
			0%   { border-color: rgba(61,156,190, 1); }
			50%  { border-color: rgba(61,156,190, 0.25); }
			100% { border-color: rgba(61,156,190, 1); }
	}


	.select-mode-hint {
		.type-label {
			font-weight: 600;
			color: var(--stjoe-blue);
		}

		margin: 6px;
		margin-left: 0;
		border: 2.5px dotted var(--stjoe-blue);
		border-radius: 4px;
		transition: all 1s;
		font-style: italic;
		font-weight: 500;
		padding: 4px;
		width: fit-content;
		animation: border-pulsate 1.25s infinite;

	}
</style>
