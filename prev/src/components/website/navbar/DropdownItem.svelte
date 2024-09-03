<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children, isSelected }: {
		children: Snippet,
		isSelected: boolean
	}  = $props();
</script>


<div class="navbar-item has-dropdown is-hoverable" class:navbar-item-selected={isSelected}>
	{@render children()}
</div>

