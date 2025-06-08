<script lang="ts">
	import type { BasinObjectType } from "$src/appstate/data/basinObject.svelte";
	import { basinObjectTypeLabel } from "$src/lib/utils/prettyNames";

	type Props = { query: string };
	const { query }: Props = $props();

	type ResultItem = {
		label: string;
		objectType: BasinObjectType;
		id: number;
	};

	let results = $state<ResultItem[]>([]);

	$effect(() => {
		results = Array.from({ length: 50 }, (_, i) => ({
			label: `${query} ${i + 1} ${query} ${i + 1} ${query} ${i + 1} ${query} ${i + 1} ${query} ${i + 1} ${query} ${i + 1}`,
			objectType: i % 2 == 0 ? "huc12" : "site-catchment",
			id: i + 1
		}));
	});

	let contentRect = $state<DOMRect>();

	$effect(() => {
		if (contentRect) {
			console.log("Content Rect Content Rect Content Rect Content Rect:", contentRect);
		}
	});
</script>

{#snippet resultItem(label: string, objectType: BasinObjectType, id: number)}
	<div class="result-item">
		<span class="result-label">{label}</span>
		<span class="result-type object-type-pill">{basinObjectTypeLabel(objectType)}</span>
	</div>
{/snippet}

<div class="basin-object-search-results" bind:contentRect>
	<div class="results-list">
		<!-- Placeholder for search results -->
		{#each results as result}
			{@render resultItem(result.label, result.objectType, result.id)}
		{/each}
	</div>
</div>

<style>
	.basin-object-search-results {
		/* background-color: #f9f9f9; */
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
</style>
