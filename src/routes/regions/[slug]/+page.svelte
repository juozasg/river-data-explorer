<script lang="ts">
	const { data } = $props();
	const Content = $derived(data.Content);
	const metadata = $derived(data.metadata);
</script>

<svelte:head>
	<title>Region: {metadata.title} ({metadata.huc})</title>
	<meta name="description" content="St Joseph River watershed Hydrological Unit HUC ${metadata.huc} water quality information">
</svelte:head>

<article>
	<h2>Region: {metadata.title}</h2>

	<Content/>

	<i>Hydrological Unit Code: {metadata.huc}</i>

	<small>...maps, interactive graphs and statistical values goe here</small>

	<small>links to webmap with selected area goes here...</small>
</article>
