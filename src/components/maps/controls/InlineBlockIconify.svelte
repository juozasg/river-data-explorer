<script lang="ts">
	import Icon from "@iconify/svelte";

	let {
		size = "1rem",
		icon = "solar:layers-outline"
	}: {
		size?: string;
		icon: string;
	} = $props();
</script>

<div class="icon inline-block-iconify" style="width: {size}; height: {size}"><Icon height={size} width={size} {icon} /></div>

<style>
	.icon {
		display: inline-block;
		position: relative;
	}
</style>
