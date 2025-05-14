<script>
	import { basinObject2 } from "$src/appstate/selection/selectionsState.svelte";
	import PanelData from "./PanelData.svelte";
	import SelectModeDropdown from "./SelectModeSelector.svelte";

	let showChange = $state(true);
</script>

<PanelData basinObject={basinObject2} selectionTarget="2" />

<style>
</style>
