<script>
	import SelectModeDropdown from "./SelectModeDropdown.svelte";

	let showChange = $state(true);
</script>

<div>
	<span>Data 2</span>
	<br />
	<h2>Selected site: 'sjrbc-15'</h2>
	{#if showChange}
		<button class="button" onclick={()=>showChange = false}>Change selection</button>
		<pre>
			DATA GOES HERE
			...
			...
			...
			...
			...
			...
			...
		</pre>
	{:else}
		<SelectModeDropdown />
	{/if}


</div>

<style>
	div {
		background-color: #60e97e;
		span {
			font-size: 3rem;
		}
		padding: 10px;
		/* border-radius: 5px; */
		width: 100%;
		height: 100%;
	}
</style>
