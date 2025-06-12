<script lang="ts">
	import BasinChart from "../chart/BasinChart.svelte";

	let clientWidth = $state(0);
	let clientHeight = $state(0);
</script>

<div class="chart-container" bind:clientWidth bind:clientHeight>
	<BasinChart width={clientWidth - 24} height={clientHeight - 70}/>
</div>

<style>
	.chart-container {
		/* padding: 10px; */
		margin-left: 28px;
		width: calc(100% - 28px);
		/* width: 100%; */
		/* background-color: rgb(76, 76, 76); */
		height: 100%;
	}
</style>