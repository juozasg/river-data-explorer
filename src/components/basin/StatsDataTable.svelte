<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	type Props = {
		data:	T[];
		children: Snippet;
		row: Snippet<[T]>;
	};
	let { data, children, row }: Props = $props();
</script>




<div class="table-container">
	<table class="table is-striped is-narrow">
		<thead>
			<tr>{@render children()}</tr>
		</thead>
		<tbody>
			{#each data as d}
			<tr>{@render row(d)}</tr>
			{/each}
		</tbody>
	</table>
</div>


<style>

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

	table {
		border-collapse: separate;
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
	}

	table:after {
		content: "";
		position: absolute;
		z-index: 1;
		bottom: 0;
		left: 0;
		pointer-events: none;
		background-image: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255, 1) 100%);
		width: 100%;
		height: 3em;
	}

	table :global(tr:last-child) {
		z-index: 200;
		position: relative;
	}

</style>
