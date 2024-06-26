<script lang="ts">
	import { page } from '$app/stores';

	let visible = false;
</script>

<div>
	<button class="button is-ghost is-dark" on:click={()=> visible =! visible}>
		Debug
	</button>
	{#if visible }
		<pre>{JSON.stringify($page, null, 2)}</pre>
		{/if}

		<a style="display:none" href="/regions/indiana">Indiana</a>
</div>

<style>
	pre {
		margin-top: 2rem;
	}
</style>