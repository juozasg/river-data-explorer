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
	{#if !selectedRegion.feature}
		<div class="placeholder" class:is-hidden={!!selectedRegion.feature}>
			<h2><a onclick={onChangeArea}>Select watershed region</a></h2>
		</div>
	{/if}
	{#if selectedRegion.feature}
		<h4 class="has-text-centered">
			Region: {selectedRegion.name} (HUC10: {selectedRegion.id})<button
				class="change-button"
				onclick={onChangeArea}
				class:blink={selectedRegion.feature}
				>Change region <Icon inline={true} class="icon" icon="lets-icons:up" />
			</button>
		</h4>
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

	h4 :global(.icon) {
		height: 24px;
		vertical-align: -6px !important;
	}

	h4 :global(.blink) {
    animation: blink 1s linear 2;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
</style>
