<script>
	import BasinObjectData from "../basinobject/BasinObjectData.svelte";
	import { basinObject1 } from "$src/appstate/selection/basinObjectSelection.svelte";

	// onMount(() => {
	// 	basinObject1.set('river-catchment', 1);
	// });
</script>

<BasinObjectData basinObject={basinObject1} selectionTarget="1" />

<style>
</style>
