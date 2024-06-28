<script lang="ts">
	import RegionTypeTabs from './RegionTypeTabs.svelte';
	import AreaSelectorMap from '$src/components/maps/AreaSelectorMap.svelte';
	import SiteSelectorMap from '$src/components/maps/SiteSelectorMap.svelte';
	import { selectedArea } from '$src/appstate/map/featureState.svelte';
	import RegionStatsPanel from '$src/components/basin/RegionStatsPanel.svelte';
	import SiteStatsPanel from '$src/components/basin/SiteStatsPanel.svelte';

	let selectedDate = $state(2002);

	const onSelectedArea = () => {
		const areaDetailsAnchor = window.document.getElementById('area-details');
		areaDetailsAnchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const onChangeArea = () => {
		const areaSelectAnchor = window.document.getElementById('basin-areas');
		areaSelectAnchor?.scrollIntoView({ behavior: 'instant', block: 'start' });
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

<div id="area-details">
	{#if !selectedArea.feature}
		<div class="placeholder" class:is-hidden={!!selectedArea.feature}>
			<h2><a onclick={onChangeArea}>Select watershed region</a></h2>
		</div>
	{/if}
	<h4 class="has-text-centered">
		Region: {selectedArea.name} (HUC10: {selectedArea.id})<button
			class="change-button"
			onclick={onChangeArea}>Change</button
		>
	</h4>

	<div class="columns" style="height: 100%" class:is-hidden={!selectedArea.feature}>
		<div class="column left-column is-half">
			<div class="details">
				<div class="details-top">
					<SiteSelectorMap />
				</div>
				<div class="details-bottom">
					<h1 style="color:purple">plot goes here</h1>
				</div>
			</div>
		</div>
		<div class="column right-column is-half">
			<div class="details">
				<div class="details-top">
					<RegionStatsPanel />
				</div>
				<div class="details-bottom">
					<SiteStatsPanel />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.details {
		height: 100%;
	}

	h3 {
		margin-bottom: 0.5rem;
	}

	.columns {
		gap: 0 !important;
	}

	.left-column {
		padding-right: 1rem !important;
	}
	.right-column {
		padding-left: 1rem !important;
	}

	#basin-areas {
		margin-bottom: 1.5rem;
	}

	.details-top {
		height: 50%;
	}

	.details-bottom {
		margin-top: 1rem;
		height: calc(50% - 1rem);
	}

	#area-details {
		margin-top: 1rem;
		/* border: 1px solid aqua; */
		height: calc(100vh - 112px);

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
</style>
