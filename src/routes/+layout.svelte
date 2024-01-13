<script lang="ts">
	import '$src/styles/app.scss';

	import { page } from '$app/stores';
	import Navbar from '$src/components/site/Navbar.svelte';

	const { data } = $props();

</script>


<header>
	<Navbar regionPages={data.regionPages} variablePages={data.variablePages} />
</header>

<main class="section">
	<div class="container">
		<div class="content">
			<slot />
		</div>
	</div>

	<hr/>

	<pre>{JSON.stringify($page, null, 2)}</pre>
</main>





<!--
	// import { preloadCode, preloadData } from '$app/navigation';
	// preloadCode('/blog', '/about', '/blog/*');
	// // OR:
	// preloadData('/blog', '/about', '/variables/*');
	// TODO: test out performance of preloading everything vs some things
-->
