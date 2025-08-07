<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	type Props = {
		data:	T[];
		thead: Snippet;
		row: Snippet<[T]>;
	};
	let { data, thead, row }: Props = $props();

	console.log('StatsDataTable', data);

</script>



<!-- <div class="fade-container"> -->
	<div class="table-container">
		<table class="table is-striped is-narrow">
			<thead>
				{@render thead()}
			</thead>
			<tbody>
				{#each data as d}
				{@render row(d)}
				{/each}
			</tbody>
		</table>
	</div>
<!-- </div> -->

<style>
	table {
		scrollbar-width:initial;
	}


	table :global(td.date) {
		min-width: 6rem;
	}

	table :global(th) {
		position: sticky;
		top: 0;
		background-color: white;
		border-bottom: 1px solid #555 !important;
		border-collapse: separate !important;
	}

	table thead {
		box-shadow:#ccc 2px 2px 5px;
	}

	table :global(td.date) {
		width: 6rem;
	}

	table {
		border-collapse: separate;
	}

	:global(table.is-striped tr:nth-child(even)) {
		background-color: var(--color-hover);
	}

	table :global(tr td:first-child), table :global(tr th:first-child) {
		border-right: 1px dashed #ccc;
	}
	table :global(tr td:first-child) {
		font-weight: 500;
	}

	.table-container {
		height: 100%;
		overflow-y: auto;
		position: relative;
	}

	.table-container :global(.table.is-narrow td), .table-container  :global(.table.is-narrow th) {
		padding: 0.25em 0.4em !important;
	}

	/* hide the fade */
	table :global(tr:last-child) {
		z-index: 200;
		position: relative;
	}
	table :global(tr:nth-last-child(2)) {
		z-index: 200;
		position: relative;
	}

</style>
