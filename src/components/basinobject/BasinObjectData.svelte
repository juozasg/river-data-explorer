<script lang="ts">
	import type { BasinObject } from "$src/appstate/selection/basinObjectSelection.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";


	type Props = { selectionTarget: "1" | "2", basinObject: BasinObject };
	const { selectionTarget, basinObject }: Props = $props();
	let showModeSelector = $state(false);


	const changeSelection = () => {
		showModeSelector = !showModeSelector;
	};
</script>

<div class="data-panel">
	{#if basinObject.isSelected}
		<div class="header">

			<div>{basinObject.objectLabel}</div>
			<div>{basinObject.objectTypeLabel}</div>
			<div class='controls'><button onclick={changeSelection}>Change</button></div>
		</div>
	{:else}
		<div>
			<span>Nothing selected</span>
		</div>
	{/if}

	<SelectModeSelector target={selectionTarget} bind:show={showModeSelector}/>
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

	button {
		font-size: 18px;
	}

	.header {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 3px;
		/* border: 1px solid salmon; */
		align-items: center;


		div {
			/* border: 1px solid #ccc; */
		}

		.controls {
			align-self: center;
		}
		/* overflow: scroll; */
		/* justify-content: space-between; */
		/* align-items: center; */
	}
</style>
