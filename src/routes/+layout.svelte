<script lang="ts">
	import { loadAppData } from "$src/lib/data/loaders/loadAppData.js";
	import '$src/styles/app.scss';

  import Notifications from '$src/components/site/Notifications.svelte';
	import Navbar from '$src/components/site/Navbar.svelte';
	import DebugFooter from '$src/components/site/DebugFooter.svelte';
	import { copyLngLat } from '$lib/copyLngLat.js';
	import { onMount } from 'svelte';
	import { toggleHideTooltips } from "$src/appstate/ui/tooltips.svelte.js";

	const { data } = $props();

	onMount(() => {
		document.body.addEventListener('keydown', copyLngLat);
		document.body.addEventListener('keydown', toggleHideTooltips.keydown);

		loadAppData(data.dataManifest, data.dataVariables);
	});
</script>

<header>
	<Navbar regionPages={data.regionPages} variablePages={data.variablePages} />
</header>

<Notifications/>

<main class="section">

	<div class="container is-fluid">
		<div class="content">
			<slot />
		</div>
	</div>

	<hr/>

	<footer class="footer">
		<DebugFooter />
	</footer>
</main>


<!--
	// import { preloadCode, preloadData } from '$app/navigation';
	// preloadCode('/blog', '/about', '/blog/*');
	// // OR:
	// preloadData('/blog', '/about', '/variables/*');
	// TODO: test out performance of preloading everything vs some things
-->
