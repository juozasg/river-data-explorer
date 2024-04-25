<script lang="ts">
	const { data } = $props();
	const Content = $derived(data.Content);
	const metadata = $derived(data.metadata);
</script>

<svelte:head>
	<title>{data.metadata.title}</title>
</svelte:head>

<article>
	<Content/>
</article>