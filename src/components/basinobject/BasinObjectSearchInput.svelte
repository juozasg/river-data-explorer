<script lang="ts">
	import { onMount } from "svelte";
	import { writable } from "svelte/store";
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";

	export let searchPlaceholder: string = "Search";
	export let searchFocused: boolean = false;

	// onMount(() => {
	// 	const input = document.querySelector("input");
	// 	if (input) {
	// 		input.addEventListener("focus", () => {
	// 			searchFocused.set(true);
	// 		});
	// 		input.addEventListener("blur", () => {
	// 			searchFocused.set(false);
	// 		});
	// 	}
	// });
</script>

<div class="basin-object-search-input">
	<div class="search-icon"><InlineBlockIconify icon="fluent:search-12-filled" size="28px" /></div>
	<input
		type="text"
		onkeydown={(e) => {
			if (e.key === "Escape") e.currentTarget?.blur();
		}}
		placeholder={searchPlaceholder} />
</div>


<style>
	.basin-object-search-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;
		width: 100%;
		/* border: 1px solid salmon; */
		/* height: 100%; */
		/* padding: 10px; */

		input {
			height: 28px;
			border-radius: 0 !important;
			padding-left: 5px !important;
			margin-bottom: 1px;
			width: calc(100% - 28px) !important;
			/* border: 1px solid var(--color-darkGrey) !important; */
		}
	}
	/* .search-input {
		display: flex;
		flex-direction: row;
		margin
	} */


</style>