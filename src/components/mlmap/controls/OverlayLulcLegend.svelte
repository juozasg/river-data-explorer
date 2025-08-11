<script lang="ts">

	let legendWidth = $state(0);
	const longLabels = [
		'Water',
		'Trees',
		'Crops',
		'Built Area',
		'Flooded vegetation',
		'Bare Ground',
		'Rangeland',
	]

	const shorterLabels = [
		'Water',
		'Trees',
		'Crops',
		'Built',
		'Flooded veg.',
		'Ground',
		'Range',
	]

	const shortestLabels = [
		'Wt',
		'Tr',
		'Cr',
		'Blt',
		'FV',
		'Gr',
		'Rng',
	]

	const colors = [
		'#419bdf',
		'#397d49',
		'#f5ee3a',
		'#e31b1b',
		'#7a87c6',
		'#a59b8f',
		'#ffae87',
	]

	const labels = $derived.by(() => {
		if (legendWidth < 200) return shortestLabels;
		if (legendWidth < 400) return shorterLabels;
		return longLabels;
	});

	$effect(() => {
		console.log('Legend width changed:', legendWidth);
	});

</script>


<div class="map-control" bind:clientWidth={legendWidth}>
	<div class="legend" aria-label="Legend">
		<div class="legend-items">
			{#each labels as label, i}
				<div class="legend-item" style="background-color: {colors[i]}">
					<span class="legend-label">{label}</span>
				</div>
			{/each}
		</div>
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

		.legend-items {
			/* display: inline-block; */
			width: 100%;
			max-width: 300px;
			display: flex;

			.legend-item {
				white-space: nowrap;
			}
		}
	}
</style>
