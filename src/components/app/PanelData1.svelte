<script>
	import { basinObject1 } from "$src/appstate/selection/selectionsState.svelte";
	import PanelData from "./PanelData.svelte";
</script>

<div>
	<h3>Data 1</h3>

	<PanelData basinObject={basinObject1} selectionTarget="1"/>
</div>

<style>
	div {
		/* background-color: #60b9e9; */
		/* span {font-size: 3rem;} */
		padding: 10px;
		/* border-radius: 5px; */
		width: 100%;
		height: 100%;
	}
</style>
