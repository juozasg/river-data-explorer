<script lang="ts">

	const results = Array.from({ length: 50 }, (_, i) => ({
		label: `Result ${i + 1} Result ${i + 1} Result ${i + 1} Result ${i + 1} Result ${i + 1} Result ${i + 1} Result ${i + 1} Result ${i + 1}`,
		objectType: 'site',
		id: i + 1
	}));

	let contentRect = $state<DOMRect>();

	$effect(() => {
		if (contentRect) {
			console.log('Content Rect Content Rect Content Rect Content Rect:', contentRect);
		}
	});
</script>



{#snippet resultItem(label: string, objectType: string, id: number)}
	<div class="result-item">
		<span class="result-type">{objectType}</span>
		<span class="result-label">{label}</span>
	</div>
{/snippet}

<div class="basin-object-search-results" bind:contentRect={contentRect}>
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
		/* max-height: 300px; */
		overflow-y: hidden;
		position: absolute;
		/* background-color: tomato; */
		z-index: 1;
		/* position: fixed; */
		max-width: calc(100% - 32px);
		/* height: 300px; */
		top: 28px;
		left: 32px;
		/* bottom: -100px; */
		overflow: scroll;
		max-height: calc(50vh - 120px);
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
		gap: 10px;
		padding: 6px;
		border-bottom: 1px solid var(--color-lightGrey);
		cursor: pointer;
	}

	.result-item:hover {
		background-color: #f0f0f0;
	}

	.result-label {
		font-weight: bold;
	}

	.result-type {
		color: #666;
	}

</style>