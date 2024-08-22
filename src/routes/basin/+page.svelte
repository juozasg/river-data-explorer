<script lang="ts">
	import Icon from '@iconify/svelte';

	import RegionTypeTabs from './RegionTypeTabs.svelte';
	import AreaSelectorMap from '$src/components/maps/RegionSelectorMap.svelte';
	import SiteSelectorMap from '$src/components/maps/SiteSelectorMap.svelte';
	import { selectedRegion } from '$src/appstate/map/featureState.svelte';
	import RegionStatsPanel from '$src/components/basin/RegionStatsPanel.svelte';
	import SiteStatsPanel from '$src/components/basin/SiteStatsPanel.svelte';
	import BasinChart from '$src/components/basin/BasinChart.svelte';

	const onSelectedArea = () => {
		const regionDetailsA = window.document.getElementById('region-details');
		regionDetailsA?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	const scrollIntoViewRegionMap = () => {
		const basinRegionsA = window.document.getElementById('basin-regions');
		basinRegionsA?.scrollIntoView({ behavior: 'instant', block: 'start' });
	};


</script>

<svelte:head>
	<title>Search the Basin</title>
</svelte:head>

<div id="basin-regions">
	<h3 id="section-select-area" class="has-text-centered">Select watershed region</h3>

	<RegionTypeTabs />

	<AreaSelectorMap onSelected={onSelectedArea} --map-height="70vh" zoom={8.35} />
</div>

<div id="region-details">
	{#if selectedRegion.feature}
		<div class="change-region-container">
			<button
				class="change-region-button"
				onclick={scrollIntoViewRegionMap}
				class:blink={selectedRegion.feature}
				>Change region <Icon inline={true} class="icon" icon="lets-icons:up" />
			</button>
		</div>
	{/if}

	<div class="columns" style="height: 100%" class:is-hidden={!selectedRegion.feature}>
		<div class="column left-column is-half">
			<div class="details">
				<div class="details-top">
					<SiteSelectorMap />
				</div>
				<div class="details-bottom">
					<BasinChart />
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

	{#if !selectedRegion.feature}
		<div class="placeholder" class:is-hidden={!!selectedRegion.feature}>
			<h2><a onclick={scrollIntoViewRegionMap}>Select watershed region</a></h2>
		</div>
	{/if}
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

	#basin-regions {
		margin-bottom: 1rem;
	}

	.details-top {
		height: 50%;
	}

	.details-bottom {
		margin-top: 1rem;
		height: calc(50% - 1rem);
	}

	#region-details {
		margin-top: 1rem;
		/* border: 1px solid aqua; */
		height: calc(100vh - 112px);
	}

	.columns {
		margin: 0;
		gap: 1rem;
	}

	.column {
		padding: 0;
		margin-bottom: 1rem;
	}

	.change-region-container {
		width: 100%;
		text-align: center;
		margin-bottom: 1rem;
	}

	button.change-region-button {
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

	.change-region-button :global(.icon) {
		height: 24px;
		vertical-align: -6px !important;
	}

	.change-region-button.blink {
		animation: blink 1s linear 2;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
