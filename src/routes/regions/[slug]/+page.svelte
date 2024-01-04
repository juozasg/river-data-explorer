<script lang="ts">
	import { page } from '$app/stores';

	const { data } = $props();
	const Content = $derived(data.Content);
	const metadata = $derived(data.metadata);
</script>

<svelte:head>
	<title>Watershed: {metadata.title} ({metadata.huc})</title>
	<meta name="description" content="St Joseph River watershed Hydrological Unit HUC ${metadata.huc} water quality information">
</svelte:head>

<article>
	<!-- <svelte:component this={content} /> -->
	<Content/>


	<i>Hydrological Unit Code: {metadata.huc}</i>

	<small>...maps, interactive graphs and statistical values goe here</small>

	<small>links to webmap with selected area goes here...</small>

	<pre>{JSON.stringify($page, null, 2)}</pre>
</article>
