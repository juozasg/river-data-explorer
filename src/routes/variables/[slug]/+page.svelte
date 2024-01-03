<script lang="ts">
	const { data } = $props();
	let content = $derived(data.content);
	let metadata = $derived(data.metadata);
</script>

<svelte:head>
	<title>Variable: {metadata.title}</title>
</svelte:head>

<article>
	<svelte:component this={content} />

	<pre>{JSON.stringify(data)}</pre>
</article>