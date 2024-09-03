<script lang="ts">
	import { onMount } from "svelte";
  import Comp2 from "./Comp2.svelte";
	import { zz } from "$lib/testpath";
	// import { loadManifests } from "./lib/data/loaders/loadManifests";

  onMount(async () => {
    console.log('APP MOUNTED', zz, typeof Comp2, Comp2);
    // const { dataManifest, variablesMetadata } = await loadManifests();

    // console.log('dataManifest', dataManifest, 'variablesMetadata', variablesMetadata);

    // document.body.addEventListener('keydown', copyLngLat);
		// document.body.addEventListener('keydown', toggleHideTooltipsKeydown);

		// loadAppData(data.dataManifest);
  });
	// const { dataManifest, variablesMetadata } = await loadManifests();

  // console.log('dataManifest', dataManifest, 'variablesMetadata', variablesMetadata);
</script>

<main>
	<h1>RIVER TIME</h1>
</main>

<style>
</style>
