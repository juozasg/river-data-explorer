<script lang="ts">
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";

	let { open = $bindable() }: { open: boolean } = $props();

	$effect(() => {
		console.log("open", open);
	});
</script>

<button onclick={() => (open = !open)} aria-label="Hamburger Menu">
	<div class:is-hidden={open}>
		<InlineBlockIconify icon="lets-icons:meatballs-menu" size="40px" />
	</div>
	<div class:is-hidden={!open}>
		<InlineBlockIconify icon="lets-icons:close-ring" size="40px" />
	</div>
</button>
