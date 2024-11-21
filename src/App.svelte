<script lang="ts">
	import "$src/styles/kbd.scss";
	import "$src/styles/variables.scss";
	import "$src/styles/app.scss";
	import { SvelteToast } from "@zerodevx/svelte-toast";

	import {
		variablesMetadata as globalVariablesMetadata,
		type VariablesMetadata
	} from "$src/appstate/variablesMetadata.svelte";

	import { onMount } from "svelte";
	import { loadAppData, type DataManifest } from "./lib/data/loaders/loadAppData";
	import { routeTestComponent } from "./test/routeTestComponent";
	import { copyMouseLocationData } from "./lib/copyMouseLocationData";
	import { toggleHideTooltipsKeydown, tooltip } from "./appstate/ui/tooltips.svelte";
	import WebsiteTooltip from "./components/tooltips/WebsiteTooltip.svelte";
	import Basin from "./components/Basin.svelte";

	type Props = {
		dataManifest: DataManifest;
		variablesMetadata: VariablesMetadata;
	};
	const { dataManifest, variablesMetadata }: Props = $props();

	let websiteTooltip = $state<WebsiteTooltip>();

	Object.assign(globalVariablesMetadata, variablesMetadata);
	loadAppData(dataManifest);

	const pathname = window.location.pathname;

	let MainComponent: any = $state(Basin);
	if (pathname === "/") {
		MainComponent = Basin;
	} else {
		MainComponent = routeTestComponent(pathname.replace("/test/", ""));
	}

	onMount(() => {
		document.body.addEventListener("keydown", copyMouseLocationData);
		document.body.addEventListener("keydown", toggleHideTooltipsKeydown);
		return () => {
			document.body.removeEventListener("keydown", copyMouseLocationData);
			document.body.removeEventListener("keydown", toggleHideTooltipsKeydown);
		};
	});

	$effect(() => {
		if (websiteTooltip) tooltip.component = websiteTooltip;
	});

	onMount(async () => {
		console.log("APP MOUNTED");
	});
</script>

<SvelteToast />
<WebsiteTooltip bind:this={websiteTooltip} />

<main>
	<MainComponent />
</main>

<style>
	:global(.u-high) {
		box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
	}

	:global(._toastMsg pre) {
		background: none;
		font-size: 0.6rem;
		padding: 0;
		margin: 0;
		overflow: hidden;
		max-width: 16rem;
	}
</style>
