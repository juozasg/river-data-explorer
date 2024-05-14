<script lang="ts">
	import '$src/styles/app.scss';

	import Navbar from '$src/components/site/Navbar.svelte';
	import DebugFooter from '$src/components/site/DebugFooter.svelte';
	import { copyLngLat } from '$lib/copyLngLat.js';
	import { onMount } from 'svelte';

	const { data } = $props();

	onMount(() => {
		document.body.addEventListener('keydown', copyLngLat);
	});

</script>


<header>
	<Navbar regionPages={data.regionPages} variablePages={data.variablePages} />
</header>


<main class="section">
	<div class="notification is-primary">
		<button class="delete"></button>
		Copied ABC, XYZ......
	</div>
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
