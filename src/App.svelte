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
	import { routeTestComponent } from "./test/routeTestComponent";
	// import { zz } from "$lib/testpath";

	type Props = {
		dataManifest: DataManifest;
		variablesMetadata: VariablesMetadata;
	};
	const { dataManifest, variablesMetadata }: Props = $props();

	Object.assign(globalVariablesMetadata, variablesMetadata);
	loadAppData(dataManifest);

	const pathname = window.location.pathname

	let Component: any = $state(BasinWorkflow);
	if (pathname === "/") {
		Component = BasinWorkflow;
	} else {
		Component = routeTestComponent(pathname.replace("/test/", ""));
	}

	onMount(async () => {
		console.log("APP MOUNTED");
	});
</script>

<main>
	<!-- <BasinWorkflow /> -->
	 <!-- howdy -->
		<Component/>
</main>

<style>
</style>
