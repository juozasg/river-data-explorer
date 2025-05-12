<script lang="ts">
	import type { BasinObject } from "$src/appstate/selection/selectionsState.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";

	type Props = { basinObject: BasinObject, selectionTarget: "1" | "2" };
	export const { basinObject, selectionTarget }: Props = $props();
</script>

{#if basinObject.isSelected()}
	<div>
		<div>{basinObject.id}</div>
		<div>{basinObject.objectType}</div>
		<div><button onclick={() => basinObject.clear()}>Clear</button></div>
	</div>
{:else}
	<div>
		<span>Nothing selected</span>
	</div>
{/if}

<SelectModeSelector target={selectionTarget} />
