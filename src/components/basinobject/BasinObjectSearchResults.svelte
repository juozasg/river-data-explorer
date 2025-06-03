<script lang="ts">

	const results = Array.from({ length: 50 }, (_, i) => ({
		label: `Result ${i + 1}`,
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
		<span class="result-label">{label}</span>
		<span class="result-type">{objectType}</span>
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
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 10px;
		/* max-height: 300px; */
		overflow-y: hidden;
		position: absolute;
		height: 100vh;
		top: 10px;
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.result-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		padding: 5px;
		border-bottom: 1px solid #eee;
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