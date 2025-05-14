<script>
	// import { basinObject1 } from "$src/appstate/selection/basinObjectSelection.svelte";
	import { onMount } from "svelte";
	import BasinObjectData from "../basinobject/BasinObjectData.svelte";
	import { basinObject1 } from "$src/appstate/selection/basinObjectSelection.svelte";

	onMount(() => {
		basinObject1.set('river-catchment', 1);
	});
</script>

<BasinObjectData basinObject={basinObject1} selectionTarget="1" />
<!-- <h1>data1</h1> -->

<style>
</style>
