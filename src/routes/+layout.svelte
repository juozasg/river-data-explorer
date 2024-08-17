<script lang="ts">
	import { loadAppData } from '$src/lib/data/loaders/loadAppData.js';
	import '$src/styles/app.scss';

	import { copyLngLat } from '$lib/copyLngLat.js';
	import { toggleHideTooltipsKeydown, tooltip } from '$src/appstate/ui/tooltips.svelte.js';
	import DebugFooter from '$src/components/website/debug/DebugFooter.svelte';
	import Navbar from '$src/components/website/Navbar.svelte';
	import Notifications from '$src/components/website/Notifications.svelte';
	import { onMount } from 'svelte';
	import WebsiteTooltip from '$src/components/website/WebsiteTooltip.svelte';

	const { data, children } = $props();

	onMount(() => {
		document.body.addEventListener('keydown', copyLngLat);
		document.body.addEventListener('keydown', toggleHideTooltipsKeydown);

		loadAppData(data.dataManifest);
	});
</script>

<header>
	<Navbar regionPages={data.regionPages} variablePages={data.variablePages} />
</header>

<Notifications />
<WebsiteTooltip bind:this={tooltip.component} />

<main class="section">
	<div class="container is-fluid">
		<div class="content">
			{@render children()}
		</div>
	</div>

	<hr />

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

<style>
	main.section {
		margin-top: 0rem;
		padding-top: 1rem;
	}

	hr {
		margin-top: 5rem;
	}
</style>
