<script>
	import { basinObject1 } from "$src/appstate/selection/selectionsState.svelte";
	import PanelData from "./PanelData.svelte";
	// import SelectModeDropdown from "./SelectModeDropdown.svelte";



</script>
<div>
	<span>Data 1</span>

	<PanelData basinObject={basinObject1} />
	<!-- <SelectModeDropdown /> -->
</div>


<style>
	div {
		background-color: #60b9e9;
		span {font-size: 3rem;}
		padding: 10px;
		/* border-radius: 5px; */
		width: 100%;
		height: 100%;
	}
</style>