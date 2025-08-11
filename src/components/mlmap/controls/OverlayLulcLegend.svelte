<script lang="ts">

	let legendWidth = $state(0);
</script>


<div class="map-control" bind:clientWidth={legendWidth}>
	<div class="legend" aria-label="Legend">
		<span class="text">HOLA</span>

	</div>
</div>

<style>
	.map-control {
		flex-grow: 1;


		z-index: 1000;
		padding-left: 0.5rem;
		padding-right: 0.5rem;

		box-shadow: var(--box-shadow);

		.legend {
			box-sizing: border-box;
			position: relative;
			height: 100%;
			width: 100%;
		}
	}
</style>
