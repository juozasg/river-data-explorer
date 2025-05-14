<script lang="ts">
	import type { BasinObject } from "$src/appstate/selection/selectionsState.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";

	type Props = { basinObject: BasinObject, selectionTarget: "1" | "2" };
	export const { basinObject, selectionTarget }: Props = $props();
</script>

<div class="data-panel">
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
</div>


<style>
	.data-panel {
		/* background-color: #60b9e9; */
		/* span {font-size: 3rem;} */
		padding: 10px;
		/* border-radius: 5px; */
		width: 100%;
		height: 100%;
		border: 1px solid #ccc;
	}
</style>
