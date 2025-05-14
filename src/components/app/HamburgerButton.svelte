<script lang="ts">
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";

	let { open = $bindable() }: { open: boolean } = $props();

	// $effect(() => {
	// 	console.log("open", open);
	// });
</script>

<button class="reset" onclick={() => (open = !open)} aria-label="Hamburger Menu">
	<div class:is-hidden={open}>
		<InlineBlockIconify icon="lets-icons:meatballs-menu" size="40px" />
		<span class="label">More</span>
	</div>
	<div class:is-hidden={!open}>
		<InlineBlockIconify icon="lets-icons:close-ring" size="40px" />
	</div>
</button>

<style>
	button {
		position: relative;
		border: none;
		box-shadow: none;

		.label {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			/* font-size: 0.8em; */
			font-size: 10px;
		}
	}
</style>
