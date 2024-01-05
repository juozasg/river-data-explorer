<script lang="ts">
	import '$src/styles/app.scss';

	import Navbar from '$src/components/Navbar.svelte';
</script>

<header>
	<Navbar/>
</header>

<main class="section">
	<div class="container">
		<div class="content">
			<slot />
		</div>
	</div>
</main>


<!--
	// import { preloadCode, preloadData } from '$app/navigation';
	// preloadCode('/blog', '/about', '/blog/*');
	// // OR:
	// preloadData('/blog', '/about', '/variables/*');
	// TODO: test out performance of preloading everything vs some things
-->
