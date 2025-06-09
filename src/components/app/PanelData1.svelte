<script>
	import BasinObjectData from "../basinobject/BasinObjectData.svelte";
	import { basinObject1 } from "$src/appstate/selection/basinObjectSelection.svelte";
	import { onMount } from "svelte";

	onMount(() => {
		basinObject1.set('site', 10002);
	});
</script>

<BasinObjectData basinObject={basinObject1} selectionTarget="1" />

<style>
</style>
