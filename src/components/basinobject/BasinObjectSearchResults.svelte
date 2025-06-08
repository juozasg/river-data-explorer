<script lang="ts">
	import { basinFeatureName, basinFeatureSiteId } from "$src/appstate/data/basinFeatureCollection.svelte";
	import { searchBasinFeatures, type BasinSearchResult } from "$src/appstate/data/basinFeatureSearchIndex.svelte";
	import type { BasinObjectType } from "$src/appstate/data/basinObject.svelte";
	import { basinObjectTypeLabel } from "$src/lib/utils/prettyNames";

	type Props = { query: string, selectObject: (objectType: BasinObjectType, id: number) => void };
	const { query, selectObject }: Props = $props();

	let results: BasinSearchResult[] = $derived(searchBasinFeatures(query));

	const resultLabel = (objectType: BasinObjectType, id: number) => {
		const name = basinFeatureName(objectType, id);
		const siteId = basinFeatureSiteId(objectType, id);

		const siteIdLabel = siteId ? ` (${siteId})` : "";
		return `${name}${siteIdLabel}`;
	};

</script>

{#snippet resultItem(objectType: BasinObjectType, id: number)}
	<div class="result-item" onclick={() => selectObject(objectType, id)}>
		<span class="result-label">{resultLabel(objectType, id)}</span>
		<span class="result-type object-type-pill">{basinObjectTypeLabel(objectType)}</span>
	</div>
{/snippet}

<div class="basin-object-search-results">
	{#if results.length === 0}
		<h4 class="no-results">No results for '{query}'</h4>
	{:else}
		<div class="results-list">
			<!-- Placeholder for search results -->
			{#each results as result}
				{@render resultItem(result[0], result[1])}
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
		z-index: 1;
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

	.result-item:hover {
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
