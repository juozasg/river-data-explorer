<script lang="ts">
  import BasinCompareControlHeading from './BasinCompareControlHeading.svelte';

	import RegionTypeTabs from '../../routes/basin/RegionTypeTabs.svelte';
	import AreaSelectorMap from '$src/components/maps/RegionSelectorMap.svelte';
	import SiteSelectorMap from '$src/components/maps/SiteSelectorMap.svelte';
	import { selectedRegion, selectedSite } from '$src/appstate/map/featureState.svelte';
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


	let yVar: string = $state('temp');
	let zVar: string = $state('do');
</script>

<div id="basin-regions">
	<h3 id="section-select-area" class="has-text-centered">Select watershed region</h3>

	<RegionTypeTabs />

	<AreaSelectorMap onSelected={onSelectedArea} --map-height="70vh" zoom={8.35} />
</div>

<div id="region-details">
<BasinCompareControlHeading/>

	<div class="columns" style="height: 100%" class:is-hidden={!selectedRegion.feature}>
		<div class="column left-column is-half">
			<div class="details">
				<div class="details-top">
					<SiteSelectorMap />
				</div>
				<div class="details-bottom">
					{#if !selectedSite.site}
					<div class="placeholder" class:is-hidden={!!selectedSite.site}>
						<h2>Click a site marker on the map to select</h2>
					</div>
					{/if}
					<BasinChart {yVar} {zVar} />
				</div>
			</div>
		</div>
		<div class="column right-column is-half">
			<div class="details">
				<div class="details-top">
					<RegionStatsPanel onVarClicked={(varname: string) => yVar = varname} />
				</div>
				<div class="details-bottom">
					<SiteStatsPanel onVarClicked={(varname: string) => zVar = varname} {yVar} {zVar}/>
				</div>
			</div>
		</div>
	</div>

	{#if !selectedRegion.feature}
		<div class="placeholder" class:is-hidden={!!selectedRegion.feature}>
			<h2><a onclick={scrollIntoViewRegionMap}>Select a watershed region</a></h2>
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


</style>

