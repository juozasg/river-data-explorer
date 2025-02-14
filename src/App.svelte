<script lang="ts">
	import AppLoadError from "./components/AppLoadError.svelte";

	import "$src/styles/kbd.scss";
	import "$src/styles/variables.scss";
	import "$src/styles/app.scss";
	import { SvelteToast } from "@zerodevx/svelte-toast";

	import { variablesMetadata, type VariablesMetadata } from "$src/appstate/variablesMetadata.svelte";

	import { onMount } from "svelte";
	import { loadAppData, type DataManifest } from "./lib/data/loaders/loadAppData";
	import { copyMouseLocationData } from "./lib/copyMouseLocationData";
	import { toggleHideTooltipsKeydown, tooltip } from "./appstate/ui/tooltips.svelte";
	import WebsiteTooltip from "./components/tooltips/WebsiteTooltip.svelte";
	import Basin from "./components/Basin.svelte";
	import { loadAppManifests } from "./lib/loadAppManifests";


	let websiteTooltip = $state<WebsiteTooltip>();

	let loadState: "loading" | "loaded" | "error" = $state("loading");

	onMount(async () => {
		console.log("App mounted! Loading manifests and data...");
		try {
			const { dataManifest: manifest, variablesMetadata: metadata } = await loadAppManifests();
			Object.assign(variablesMetadata, metadata);
			loadAppData(manifest);
			loadState = "loaded";
		} catch (e) {
			console.error("Error loading app", e);
			loadState = "error";
		}
	});

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
</script>

{#if loadState === "loaded"}
	<SvelteToast />
	<WebsiteTooltip bind:this={websiteTooltip} />
	<main>
		<Basin />
	</main>
{:else if loadState === "loading"}
	<div class="loading">...</div>
{:else if loadState === "error"}
	<AppLoadError />
{/if}

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
