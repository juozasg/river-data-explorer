<script lang="ts">
	import RegionTypeTabs from './RegionTypeTabs.svelte';
	import WebMap from '$src/components/maps/WebMap.svelte';
	import AreaSitesVariableSelects from '$src/components/basin/AreaSitesVariableSelects.svelte';
	import AreaSelectorMap from '$src/components/maps/AreaSelectorMap.svelte';
	import { selectedArea } from '$src/appstate/map/hoveredSelectedFeatures.svelte';

	let selectedDate = $state(2002);

	const onSelected = () => {
		const areaDetailsElement = window.document.getElementById('section-select-area-data');
		console.log('areaDetailsElement', areaDetailsElement);
    areaDetailsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};
</script>

<svelte:head>
	<title>Search the Basin</title>
</svelte:head>

<h4 id="section-select-area" class="has-text-centered">Select watershed region</h4>

<RegionTypeTabs />

<div class="areas">
	<AreaSelectorMap {onSelected} --map-height="70vh" zoom={8.35} />
</div>

<h4 id="section-select-area-data" class="has-text-centered">Select data</h4>

<AreaSitesVariableSelects />

<div class="details">
	<div class="columns">
		<div class="column map-preview-column">
			<WebMap type="sites" --map-height="400px" />
		</div>
		<div class="column dataset-column">Region Dashboard</div>
	</div>
</div>

<div class="timelapse-container">
	<div id="slider-description"><strong>{selectedDate}</strong></div>
	<input id="slider" type="range" min="1990" max="2024" step="1" bind:value={selectedDate} />
</div>

<h4 id="section-area-data-results" class="has-text-centered">Results</h4>

<div class="results">
	<a href="/regions/indiana">Indiana</a>
</div>

<style>
	.timelapse-container {
		margin-top: 1rem;
		/* display: flex; */
		/* flex-direction: column; */
		/* align-items: center; */
		#slider-description {
			text-align: center;
		}

		#slider {
			width: 100%;
		}
	}

	h4 {
		margin-bottom: 0.2rem;
	}

	.areas {
		margin-bottom: 2.5rem;
	}

	.details {
		margin-top: 1rem;
	}

	.columns {
		margin: 0;
		gap: 1rem;
	}

	.column {
		padding: 0;
		margin-bottom: 1rem;
	}

	#section-area-data-results {
		margin-top: 2rem;
	}

	.results {
		height: 400px;
		background-color: aquamarine;
		margin-top: 1rem;
	}

	.dataset-column {
		min-height: 400px;

		/* margin-left: 1rem; */
		background-color: #f0f0f0;
		font-size: 3rem;
		/* text-align: center; */
		padding: 1rem;

		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
</style>
