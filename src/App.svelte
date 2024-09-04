<script lang="ts">
	import {
		variablesMetadata as globalVariablesMetadata,
		type VariablesMetadata
	} from "$src/appstate/variablesMetadata.svelte";

	import { onMount } from "svelte";
	import { copyLngLat } from "./lib/copyLngLat";
	import { toggleHideTooltipsKeydown } from "./appstate/ui/tooltips.svelte";
	import { loadAppData, type DataManifest } from "./lib/data/loaders/loadAppData";
	import BasinWorkflow from "./components/basin/BasinWorkflow.svelte";
	// import { zz } from "$lib/testpath";

	type Props = {
		dataManifest: DataManifest;
		variablesMetadata: VariablesMetadata;
	};
	const { dataManifest, variablesMetadata }: Props = $props();

	Object.assign(globalVariablesMetadata, variablesMetadata);
	loadAppData(dataManifest);

	document.body.addEventListener("keydown", copyLngLat);
	document.body.addEventListener("keydown", toggleHideTooltipsKeydown);

	onMount(async () => {
		console.log("APP MOUNTED");
	});
</script>

<main>
	<BasinWorkflow />
</main>

<style>
</style>
