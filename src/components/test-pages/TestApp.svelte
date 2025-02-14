<script lang="ts">
	import { onMount } from "svelte";
	import * as fixtureModules from "./fixtures";
	import { variablesMetadata } from "$src/appstate/variablesMetadata.svelte";
	import { loadAppManifests } from "$src/lib/loadAppManifests";
	import { defineGlobal } from "$src/lib/utils";
	type Props = {
		testName?: string;
	};
	const { testName }: Props = $props();

	const fixtures = Object.keys(fixtureModules);
	const Fixture = $derived(testName && (fixtureModules as any)[testName]);

	onMount(async () => {
		try {
			const { dataManifest: manifest, variablesMetadata: metadata } = await loadAppManifests();
			Object.assign(variablesMetadata, metadata);
			defineGlobal('variablesMetadata', metadata);
		} catch (e) {
			console.error("Error loading app", e);
		}
	});
</script>

{#if Fixture}
	<Fixture />
{:else}
	<main>
		<h3>Test Pages</h3>
		{#each fixtures as fixture}
			<a href="/test/{fixture}">{fixture}</a><br />
		{/each}
	</main>
{/if}

<style>
	main {
		padding: 2rem;
		font-size: 120%;
		a {
			display: inline-block;
			margin: 0.25rem;
		}
	}
</style>
