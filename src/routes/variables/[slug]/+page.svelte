<script lang="ts">
	import { page } from '$app/stores';

	const { data } = $props();
	const Content = $derived(data.Content);
	const metadata = $derived(data.metadata);
</script>

<svelte:head>
	<title>Variable: {metadata.title}</title>
	<meta name="description" content="St Joseph River watershed water quality information variable {metadata.title}">

</svelte:head>

<article>
	<Content/>
	<pre>{JSON.stringify($page, null, 2)}</pre>
</article>
