<script lang="ts">
	import '../app.scss';

	import '$lib/styles/global.scss';
	import SiteNavMenu from '$src/components/SiteNavMenu.svelte';
</script>

<header>
	<SiteNavMenu></SiteNavMenu>
</header>

<main>
	<slot />
</main>


<!--
// import { preloadCode, preloadData } from '$app/navigation';
// preloadCode('/blog', '/about', '/blog/*');
// // OR:
// preloadData('/blog', '/about', '/variables/*');
// TODO: test out performance of preloading everything vs some things
-->
