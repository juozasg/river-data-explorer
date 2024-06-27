<script lang="ts">
	import StatsDataTable from '$src/components/basin/StatsDataTable.svelte';
	import type { F } from 'vitest/dist/reporters-yx5ZTtEV.js';

	type Fruit = {
		name: string;
		qty: number;
		price: number;
	};
	const fruits: Fruit[] = [
	{ name: '1apples', qty: 5, price: 2 },
	{ name: '2bananas', qty: 10, price: 1 },
	{ name: '3cherries', qty: 20, price: 0.5 },
	{ name: '4apples', qty: 5, price: 2 },
	{ name: '5bananas', qty: 10, price: 1 },
	{ name: '6cherries', qty: 20, price: 0.5 },
	{ name: '7apples', qty: 5, price: 2 },
	{ name: '8bananas', qty: 10, price: 1 },
	{ name: '9cherries', qty: 20, price: 0.5 },
	{ name: '...1apples', qty: 5, price: 2 },
	{ name: '2bananas', qty: 10, price: 1 },
	{ name: '3cherries', qty: 20, price: 0.5 },
	{ name: '4apples', qty: 5, price: 2 },
	{ name: '5bananas', qty: 10, price: 1 },
	{ name: '6cherries', qty: 20, price: 0.5 },
	{ name: '7apples', qty: 5, price: 2 },
	{ name: '8bananas', qty: 10, price: 1 },
	{ name: '9cherries', qty: 20, price: 0.5 },
	{ name: '......1apples', qty: 5, price: 2 },
	{ name: '2bananas', qty: 10, price: 1 },
	{ name: '3cherries', qty: 20, price: 0.5 },
	{ name: '4apples', qty: 5, price: 2 },
	{ name: '5bananas', qty: 10, price: 1 },
	{ name: '6cherries', qty: 20, price: 0.5 },
	{ name: '7apples', qty: 5, price: 2 },
	{ name: '8bananas', qty: 10, price: 1 },
	{ name: '9cherries', qty: 20, price: 0.5 },
	];
</script>

<svelte:head>
<title>Visualize</title>
</svelte:head>

<div>
	<h2>Visualize</h2>

	<div id="example-stats">
		<StatsDataTable data={fruits}>
			<th>Name</th>
			<th>Quantity</th>
			<th>Price</th>

			{#snippet row(d)}
			<td>{d.name}</td>
			<td>{d.qty}</td>
			<td>{d.price}</td>
			{/snippet}
		</StatsDataTable>
	</div>
</div>


<style>
	h2 {
		margin-bottom: 1rem;
	}

	#example-stats {
		margin-top: 2rem;
		width: 300px;
		height: 400px;
	}
</style>
