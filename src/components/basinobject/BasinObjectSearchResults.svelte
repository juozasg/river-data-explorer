<script lang="ts">
	import { basinFeatureName, basinFeatureSiteId } from "$src/appstate/data/basinFeatureCollection.svelte";
	import { searchBasinFeatures, type BasinSearchResult } from "$src/appstate/data/basinFeatureSearchIndex.svelte";
	import type { BasinObjectType } from "$src/appstate/data/basinObject.svelte";
	import { elementInView, isElementInScrollView } from "$src/lib/utils/dom";
	import { basinObjectTypeLabel } from "$src/lib/utils/prettyNames";

	type Props = { query: string, selectObject: (objectType: BasinObjectType, id: number) => void };
	const { query, selectObject }: Props = $props();

	let results: BasinSearchResult[] = $derived(searchBasinFeatures(query));
	let resultsDiv: HTMLDivElement;

	let kbfocusIndex = $state<number>();

	export const keydown = async (key: 'up' | 'down' | 'enter') => {
		if(results.length === 0) return;
		if(key === 'up' && kbfocusIndex !== undefined) {
			kbfocusIndex = (kbfocusIndex > 0) ? kbfocusIndex - 1 : results.length - 1;
		} else if(key === 'down') {
			if(kbfocusIndex === undefined || kbfocusIndex < 0) {
				kbfocusIndex = 0;
			} else {
				kbfocusIndex = (kbfocusIndex < results.length - 1) ? kbfocusIndex + 1 : 0;

			}
		} else if(key === 'enter' && kbfocusIndex !== undefined) {
			if(kbfocusIndex !== undefined && kbfocusIndex >= 0 && kbfocusIndex < results.length) {
				// console.log('Selected result:', results[kbfocusIndex]);
				const [objectType, id] = results[kbfocusIndex];
				selectObject(objectType, id);
			}
			return;
		}

		if(( key === 'down') && kbfocusIndex !== undefined && kbfocusIndex >= 0 && kbfocusIndex < results.length) {
			// Scroll the resultsDiv to bring the focused item into view
			const focusedItem = resultsDiv.querySelector(`#item-${results[kbfocusIndex][1]}`) as HTMLElement | undefined;
			if(!focusedItem) return;
			if(kbfocusIndex > 6) focusedItem.scrollIntoView();
		}
		if(( key === 'up') && kbfocusIndex !== undefined && kbfocusIndex >= 0 && kbfocusIndex < results.length) {
			// Scroll the resultsDiv to bring the focused item into view
			const focusedItem = resultsDiv.querySelector(`#item-${results[kbfocusIndex][1]}`) as HTMLElement | undefined;
			if(!focusedItem) return;
			focusedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		}


	};

</script>

{#snippet resultItem(objectType: BasinObjectType, id: number, focus = false)}
	<div class={["result-item", {kbfocus: focus}]} id="item-{id}" onclick={() => selectObject(objectType, id)}>
		<span class="result-label">{basinFeatureName(objectType, id, true)}</span>
		<span class="result-type object-type-pill">{basinObjectTypeLabel(objectType)}</span>
	</div>
{/snippet}

<div class="basin-object-search-results" bind:this={resultsDiv}>
	{#if results.length === 0}
		<h4 class="no-results">No results for '{query}'</h4>
	{:else}
		<div class="results-list">
			<!-- Placeholder for search results -->
			{#each results as result, i}
				{@render resultItem(result[0], result[1], kbfocusIndex === i)}
			{/each}
		</div>
	{/if}
</div>

<style>
	.basin-object-search-results {
		background-color: white;
		border: 1px solid var(--color-darkGrey);
		border-radius: 4px;
		padding: 10px;
		padding-top: 0px;
		padding-right: 6px;
		overflow-y: hidden;
		position: absolute;
		z-index: 1000;
		max-width: calc(100% - 32px);
		top: 28px;
		left: 32px;
		overflow: scroll;
		max-height: calc(50vh - 96px);
	}

	:global(.mobile .basin-object-search-results) {
		max-height: calc(80vh - 120px);
	}

	.results-list {
		display: flex;
		flex-direction: column;
		padding-top: 8px;
		/* gap: 5px; */
	}

	.result-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 6px;
		border-bottom: 1px solid var(--color-lightGrey);
		cursor: pointer;
	}

	.result-item:hover, .result-item.kbfocus {
		background-color: #f0f0f0;
	}

	.result-label {
		font-weight: 500;
	}

	.result-type {
		justify-self: right;
		/* color: #666; */
		width: fit-content;
		white-space: nowrap;
		margin: 0;
		padding: 4px;
		font-size: 16px;
		height: 24px;
	}

	.no-results {
		margin-bottom: -8px;
	}
</style>
