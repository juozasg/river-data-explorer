<script lang="ts">
	import {
		variablesMetadata as globalVariablesMetadata,
		type VariablesMetadata
	} from "$src/appstate/variablesMetadata.svelte";

	import { onMount } from "svelte";
	import BasinWorkflow from "./components/basin/BasinWorkflow.svelte";
	import { loadAppData, type DataManifest } from "./lib/data/loaders/loadAppData";
	import { routeTestComponent } from "./test/routeTestComponent";

	type Props = {
		dataManifest: DataManifest;
		variablesMetadata: VariablesMetadata;
	};
	const { dataManifest, variablesMetadata }: Props = $props();

	Object.assign(globalVariablesMetadata, variablesMetadata);
	loadAppData(dataManifest);

	const pathname = window.location.pathname

	let MainComponent: any = $state(BasinWorkflow);
	if (pathname === "/") {
		MainComponent = BasinWorkflow;
	} else {
		MainComponent = routeTestComponent(pathname.replace("/test/", ""));
	}

	onMount(async () => {
		console.log("APP MOUNTED");
	});
</script>

<main >
		<MainComponent/>
</main>

<style>
</style>
