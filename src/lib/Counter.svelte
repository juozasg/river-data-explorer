<script lang="ts">
	let z: number = 1;
	z = "3";
	let count: number = 0;
	const increment = () => {
		count += 1;
	};
</script>

eee2
<button on:click={increment} on:click={increment}>
	count is {count}
</button>
