<script lang="ts">
	import type { BasinObjectType } from "$src/appstate/data/basinObject.svelte";
	import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import { clickOutside } from "$src/lib/svelte/clickOutside";
	import InlineBlockIconify from "../icons/InlineBlockIconify.svelte";
	import BasinObjectSearchResults from "./BasinObjectSearchResults.svelte";

	type Props = {
		target: "1" | "2";
	};

	const { target }: Props = $props();

	let searchPlaceholder: string = "Search";
	let searchFocused: boolean = $state(false);

	let value: string = $state("");
	let showResults = $state(false);

	let inputElement = $state<HTMLInputElement>();
	let searchResults = $state<BasinObjectSearchResults>();

	$effect(() => {
		if (searchFocused && value.length > 1) showResults = true;
	});

	const onfocus = () => (searchFocused = true);
	const onblur = () => (searchFocused = false);

	const selectObject = (objectType: BasinObjectType, id: number) => {
		console.log("selectObject", objectType, id);
		if (target === "1") {
			basinObject1.set(objectType, id);
			if (mapSelectionMode.mode == "auto") mapSelectionMode.target = "2"; // Switch to target 2 if in auto mode
		} else {
			basinObject2.set(objectType, id);
			if (mapSelectionMode.mode == "auto") mapSelectionMode.target = "1";
		}
		value = "";
	};

	const inputKeydown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			inputElement?.blur();
			showResults = false;
		}

		if (searchResults) {
			if (e.key === "ArrowDown") {
				searchResults.keydown("down");
				e.preventDefault();
			} else if (e.key === "ArrowUp") {
				searchResults.keydown("up");
				e.preventDefault();
			} else if (e.key === "Enter") {
				searchResults.keydown("enter");
				e.preventDefault();
			}
		}
	};
</script>

<div
	use:clickOutside={() => {
		showResults = false;
		inputElement?.blur();
	}}>
	<div class="basin-object-search-input">
		<div class="search-icon"><InlineBlockIconify icon="fluent:search-12-filled" size="28px" /></div>
		<input
			type="text"
			{onblur}
			{onfocus}
			bind:value
			bind:this={inputElement}
			onkeydown={inputKeydown}
			placeholder={searchPlaceholder} />
	</div>

	{#if showResults}
		<BasinObjectSearchResults bind:this={searchResults} {selectObject} query={value} />
	{/if}
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
