<script>
	export let data;
</script>

<svelte:head>
	<title>Variable: {data.metadata.title}</title>
</svelte:head>

<article>
	<svelte:component this={data.content} />
</article>