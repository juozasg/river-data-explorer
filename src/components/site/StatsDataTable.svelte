<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	type Props = {
		data:	T[];
		children: Snippet;
		row: Snippet<[T]>;
	};
	let { data, children, row }: Props = $props();
</script>



<div class="fade-container">
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

	table :global(td.date) {
		width: 6rem;
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
		position: relative;
	}

	.fade-container {
		position: relative;
		height: 100%;
		overflow: hidden;
	}

	.fade-container:after {
		content: '';
		position: absolute;
		z-index: 1;
		bottom: 0;
		left: 0;
		/* background-color: green; */
		pointer-events: none;
		background-image: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255, 1) 90%);
		width: 100%;
		height: 2em;
	}

	.table-container :global(.table.is-narrow td), .table-container  :global(.table.is-narrow th) {
		padding: 0.125em 0.4em !important;
	}

	/* hide the fade */
	table :global(tr:last-child) {
		z-index: 200;
		position: relative;
	}

</style>
