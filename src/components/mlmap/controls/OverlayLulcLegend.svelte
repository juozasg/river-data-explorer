<script lang="ts">

	const { mapWidth } = $props();
	let legendWidth = $state(0);
	const longLabels = [
		'Water',
		'Trees',
		'Crops',
		'Built Area',
		'Rangeland',
		'Flooded vegtn',
		'Bare Ground',
	]

	const shorterLabels = [
		'Water',
		'Trees',
		'Crops',
		'Built',
		'Range',
		'Flood veg.',
		'Ground',
	]

	const shortestLabels = [
		'Wt',
		'Tr',
		'Cr',
		'Blt',
		'Rng',
		'FV',
		'Gr',
	]
	const tinyLabels = [
		'W',
		'T',
		'C',
		'B',
		'R',
		'F',
		'G',
	]

	const colors = [
		'#419bdf',
		'#397d49',
		'#fffee9',
		'#e31b1b',
		'#ffae87',
		'#7a87c6',
		'#a59b8f',
	]

	const labels = $derived.by(() => {
		if (mapWidth < 400) return tinyLabels;
		if (mapWidth < 600) return shortestLabels;
		if (legendWidth < 400) return shorterLabels;
		return longLabels;
	});

	$effect(() => {
		console.log('Legend width changed:', legendWidth, mapWidth);
	});

</script>


<div class="map-control" bind:clientWidth={legendWidth} class:small={mapWidth < 600} class:tiny={mapWidth < 400}>
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
		padding-left: 5px;
		padding-right: 5px;

		box-shadow: var(--box-shadow);

		max-width: 576px;
		.legend {
			box-sizing: border-box;
			position: relative;
			height: 100%;
			width: 100%;
			overflow: hidden;
		}

		.legend-items {
			/* display: inline-block; */
			width: 100%;
			max-width: 300px;
			/* display: inline-flex; */
			white-space: nowrap;
			/* align-items: center; */
			/* overflow: hidden; */

			.legend-item {
				white-space: nowrap;
				width: fit-content;
				display: inline-block;
				padding: 3px;
				margin-top: 3px;
				margin-right: 6px;
				font-weight: 600;
				border-radius: 3px;
			}
		}
	}

	.map-control.small {
		.legend-items {
			max-width: 154px;
		}
	}
	.map-control.tiny {
		.legend-items {
			max-width: 50px;
			/* font-size: 10px;
			.legend-item {
				padding: 2px;
				margin-right: 1px;
				margin-top: 6px;
			} */
		}
	}
</style>
