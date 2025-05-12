<script>
	import { basinObject2 } from "$src/appstate/selection/selectionsState.svelte";
	import PanelData from "./PanelData.svelte";
	import SelectModeDropdown from "./SelectModeSelector.svelte";

	let showChange = $state(true);
</script>

<div>
	<h3>Data 2</h3>
	<PanelData basinObject={basinObject2} selectionTarget="2" />

</div>

<style>
	div {
		/* background-color: #60e97e; */
		/* span {
			font-size:2rem;
		} */
		padding: 10px;
		/* border-radius: 5px; */
		width: 100%;
		height: 100%;
	}
</style>
