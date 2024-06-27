<script lang="ts">
	import RegionTypeTabs from './RegionTypeTabs.svelte';
	import AreaSitesVariableSelects from '$src/components/basin/AreaSitesVariableSelects.svelte';
	import RegionDashboard from '$src/components/basin/RegionDashboard.svelte';
	import AreaSelectorMap from '$src/components/maps/AreaSelectorMap.svelte';
	import SiteSelectorMap from '$src/components/maps/SiteSelectorMap.svelte';
	import { selectedArea } from '$src/appstate/map/featureState.svelte';

	let selectedDate = $state(2002);

	const onSelectedArea = () => {
		const areaDetailsElement = window.document.getElementById('basin-details');
		areaDetailsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const onChangeArea = () => {
		const areaDetailsElement = window.document.getElementById('basin-areas');
		areaDetailsElement?.scrollIntoView({ behavior: 'instant', block: 'start' });
	};
</script>

<svelte:head>
<title>Search the Basin</title>
</svelte:head>

<div id="basin-areas">
	<h3 id="section-select-area" class="has-text-centered">Select watershed region</h3>

	<RegionTypeTabs />

	<AreaSelectorMap onSelected={onSelectedArea} --map-height="70vh" zoom={8.35} />
</div>

<!-- <AreaSitesVariableSelects /> -->

<div id="basin-details">
	{#if selectedArea.feature}
	<h4 class="has-text-centered">
		Region: {selectedArea.name} (HUC10: {selectedArea.id})<button
		class="change-button"
		onclick={onChangeArea}>Change</button
		>
	</h4>

	<div></div>

	<div class="columns">
		<div class="column map-preview-column is-half">
			<SiteSelectorMap --map-height="calc((100vh - 96px)/2)" />
			<div id="basin-plot">
				<h1 style="color:purple">plot goes here</h1>
			</div>
		</div>
		<div class="column dataset-column is-half">
			<RegionDashboard />
		</div>
	</div>
	{:else}
	<div class="placeholder">
		<h2><a href="#section-select-area">Select watershed region</a></h2>
	</div>
	{/if}
</div>

<!-- <div class="timelapse-container">
<div id="slider-description"><strong>{selectedDate}</strong></div>
<input id="slider" type="range" min="1990" max="2024" step="1" bind:value={selectedDate} />
</div>

<h4 id="section-area-data-results" class="has-text-centered">Results</h4>

<div class="results">
</div> -->
<!-- <a href="/regions/indiana"></a> -->

<style>
	h3 {
		margin-bottom: 0.5rem;
	}

	#basin-areas {
		margin-bottom: 1.5rem;
	}

	#basin-details {
		margin-top: 1rem;
		border: 1px solid aqua;
		height: calc(100vh - 80px);

		#basin-plot {
			margin-top: 1rem;
			border: 1px solid red;
			height: calc((100vh - 200px) / 2);
		}
		h4 button.change-button {
			margin-left: 1rem;
			font-weight: 400;

			background: none !important;
			border: none;
			padding: 0 !important;

			font-size: 1.25rem;
			color: #485fc7;
			cursor: pointer;
			text-decoration: dotted underline;
			cursor: pointer;
		}
	}

	.columns {
		margin: 0;
		gap: 1rem;
	}

	.column {
		padding: 0;
		margin-bottom: 1rem;
	}

	.dataset-column {
		min-height: 400px;

		/* margin-left: 1rem; */
		/* background-color: #f0f0f0; */
		/* font-size: 3rem; */
		/* text-align: center; */
		padding: 1rem;
		padding-right: 0;
		padding-top: 0;

		/* .placeholder {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		} */
	}
</style>
