<script lang="ts">
	const { data } = $props();
	const Content = $derived(data.Content);
	const metadata = $derived(data.metadata);
</script>

<svelte:head>
	<title>Variable: {metadata.title}</title>
	<meta name="description" content="St Joseph River watershed water quality information variable {metadata.title}">
</svelte:head>

<article>
	<h2>Variable: {metadata.title}</h2>

	<Content/>
</article>
