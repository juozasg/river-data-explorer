<script lang="ts">
	import { onMount } from "svelte";
	import Comp2 from "./Comp2.svelte";
	// import { zz } from "$lib/testpath";

	import { loadManifests } from "./lib/data/loaders/loadManifests";

  const { dataManifest, variablesMetadata } = $props();

	// console.log("app init d=", d);
	// export const test = async () => {
  //   console.log('test func')
	// 	const r = await fetch("http://localhost:8080/a");
	// 	console.log("r", r);
	// 	const j = await r.json();
	// 	console.log("j", j);
	// };

  // test();

	onMount(async () => {
		console.log("APP MOUNTED 1");
		// // const { dataManifest, variablesMetadata } = await loadManifests();
		// const r = await fetch('http://localhost:8080/a');
		// console.log('r', r);
		// const j = await r.json();
		// console.log('j', j);

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
