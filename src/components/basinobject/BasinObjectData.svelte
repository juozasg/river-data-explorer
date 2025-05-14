<script lang="ts">
	import type { BasinObject } from "$src/appstate/selection/basinObjectSelection.svelte";
	import SelectModeSelector from "./SelectModeSelector.svelte";


	type Props = { selectionTarget: "1" | "2", basinObject: BasinObject };
	const { selectionTarget, basinObject }: Props = $props();
	let showModeSelector = $state(false);


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
				<div class='controls'><button onclick={() => showModeSelector = true}>Change</button></div>
			{/if}

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
			margin-left: 10px;
		}
		/* div { */
			/* border: 1px solid #ccc; */
		/* } */

		.controls {
			align-self: center;
		}
		/* overflow: scroll; */
		/* justify-content: space-between; */
		/* align-items: center; */
	}
</style>
