<script lang="ts">
	import BasinChart from "../chart/BasinChart.svelte";
</script>

<div class="chart-container">
	<BasinChart/>
</div>

<style>
	.chart-container {
		/* padding: 10px; */
		margin-left: 28px;
		width: calc(100% - 28px);
		/* width: 100%; */
		background-color: rgb(76, 76, 76);
		height: 100%;
	}
</style>