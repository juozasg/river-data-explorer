<script lang="ts">
	import { onMount } from "svelte";
	import { loadManifests } from "./lib/data/loaders/loadManifests";

  onMount(async () => {
    const { dataManifest, variablesMetadata } = await loadManifests();

    console.log('dataManifest', dataManifest, 'variablesMetadata', variablesMetadata);
  });
	// const { dataManifest, variablesMetadata } = await loadManifests();

  // console.log('dataManifest', dataManifest, 'variablesMetadata', variablesMetadata);
</script>

<main>
	<h1>RIVER TIME</h1>
</main>

<style>
</style>
