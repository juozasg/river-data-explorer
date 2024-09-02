<script lang="ts">
	import * as ml from 'maplibre-gl';
	import ChangeRegionHeader from './ChangeRegionHeader.svelte';

	import {
		MapFeatureSelectionState,
		toggleSelectedFeatureState
	} from '$src/appstate/map/featureState.svelte';
	import { addSitesDetailsMapLayers } from '$src/lib/data/map/mapData/sitesMapDataLayers';
	import type { Site } from '$src/lib/types/site';
	import { fitFeatureBounds } from '$src/lib/utils/maplibre';
	import RegionTypeTabs from '../../routes/basin/RegionTypeTabs.svelte';
	import VarDataMap from '../maps/VarDataMap.svelte';
	import RegionStatsPanel from './stats/RegionStatsPanel.svelte';
	import { regionFeatures, type RegionFeature } from '$src/appstate/data/features.svelte';
	import SiteStatsPanel from './stats/SiteStatsPanel.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import BasinChart from './BasinChart.svelte';
	import { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';
	import { data } from '@maptiler/sdk';
	import { UTCDayDate } from '$src/lib/utils';

	let regionSelectionMap = $state<VarDataMap>();
	let detailsMap = $state<VarDataMap>();

	const updatedRegionSelection = (curr?: RegionFeature, u?: RegionFeature) => {
		toggleSelectedFeatureState(regionSelectionMap?.mlmMap, curr, u);
		toggleSelectedFeatureState(detailsMap?.mlmMap, curr, u);

		if (u && detailsMap?.mlmMap) {
			fitFeatureBounds(detailsMap.mlmMap, u);
		}

		// region selection changed, focus details map
		if (u) {
			const regionDetailsA = window.document.getElementById('region-details');
			regionDetailsA?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	function regionMapClick(map: ml.Map, p: ml.PointLike) {
		if (regionSelectionMap?.hoveredSite || !regionSelectionMap?.hoveredRegion.feature) {
			selectedSite = regionSelectionMap?.hoveredSite;
		}
		console.log(
			'selectedSite',
			selectedSite,
			'selectedRegion',
			selectedRegion.feature,
			'hoveredRegion',
			regionSelectionMap?.hoveredRegion.feature
		);
		if (!regionSelectionMap?.hoveredSite || !selectedRegion.feature) {
			selectedRegion.feature = regionSelectionMap?.hoveredRegion.feature;
		}
		selectedRiver.feature = regionSelectionMap?.hoveredRiver.feature;
	}

	function detailsMapClick(map: ml.Map, p: ml.PointLike) {
		selectedSite = detailsMap?.hoveredSite;
		// selectedRegion.feature = detailsMap?.hoveredRegion.feature;
		selectedRiver.feature = detailsMap?.hoveredRiver.feature;
	}

	const selectedRegion = new MapFeatureSelectionState(updatedRegionSelection);

	const selectedRiver = new MapFeatureSelectionState((c, u) => {}); // TODO: selecting river does something
	let selectedSite = $state<Site>();

	const dataSelection = new DataSelectionState();

	// dataSelection.yVar = 'temp';
	// dataSelection.zVar = 'do';

	// setTimeout(() => {
	// 	dataSelection.zVar = 'do';
	// }, 4000);

	let detailMapVarname = $state('temp');
	let detailMapVardate = $state(UTCDayDate());
	function chartOnDateSelected(d: Date) {
		if(detailsMap) {
			detailsMap.setInternalDate(d);
			detailMapVarname = dataSelection.yVar || dataSelection.zVar || 'temp';
		}
	}


	// TEST
	const testRegion = $derived(
		regionFeatures.getRegionCollection('huc10').find((r) => r.id === '0405000118')
	);

	$effect(() => {
		if(testRegion && detailsMap?.mlmComponent?.dataLoaded()) selectedRegion.feature = testRegion;
	});

	const testSite = $derived(sites.findById('sjrbc-18'));

	$effect(() => {
		if(testSite) {
			selectedSite = testSite;
			dataSelection.ySite = testSite;
		}
	});

	$effect(() => {
		console.log('-- data Selection', dataSelection);
	});


	function regionTableVarClicked(varname: string) {
		console.log('region data table clicked', varname);
		detailMapVarname = varname;
	}

	function siteTableVarClicked(varname: string) {
		console.log('site data table clicked 111', varname);
		// detailMapVarname = varname;
		dataSelection.ySite = selectedSite;
		dataSelection.yVar = varname;
	}
</script>

<div id="basin-regions">
	<h3 id="section-select-area" class="has-text-centered">Select watershed region</h3>

	<RegionTypeTabs />
	<VarDataMap
		bind:this={regionSelectionMap}
		zoom={8.35}
		{selectedSite}
		{dataSelection}
		mapClick={regionMapClick}
		{selectedRegion}
		--map-height="70vh"
	/>
</div>

<div id="region-details">
	<ChangeRegionHeader {selectedRegion} />

	<div class="columns" style="height: 100%">
		<div class="column left-column is-half">
			<div class="details">
				<div class="details-top site-selector-map">
					<VarDataMap
						bind:this={detailsMap}
						{selectedSite}
						{dataSelection}
						mapClick={detailsMapClick}
						{selectedRegion}
						addLayers={addSitesDetailsMapLayers}
						bind:varname={detailMapVarname}
						bind:vardate={detailMapVardate}
						showRegionTooltip={false}
					/>
					<!-- --map-height="" -->
				</div>
				<div class="details-bottom">
					<BasinChart {dataSelection} onDateSelected={chartOnDateSelected} />
				</div>
			</div>
		</div>
		<div class="column right-column is-half">
			<div class="details">
				<div class="details-top">
					{#if selectedRegion.feature}
						<RegionStatsPanel
							{dataSelection}
							region={selectedRegion.feature}
							onVarClicked={regionTableVarClicked}
						/>
					{/if}

				</div>
				<div class="details-bottom">
					{#if selectedSite}
						<SiteStatsPanel
							{dataSelection}
							site={selectedSite}
							onVarClicked={siteTableVarClicked}

						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<!--
	{#if !selectedRegion.feature}
		<div class="placeholder" class:is-hidden={!!selectedRegion.feature}>
			<h2><a onclick={scrollIntoViewRegionMap}>Select a watershed region</a></h2>
		</div>
	{/if} -->
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

	:global(.site-selector-map .maplibregl-ctrl-attrib-inner) {
		display: none !important;
	}
	:global(.site-selector-map .maplibregl-ctrl-attrib) {
		display: none !important;
	}

	.site-selector-map :global(.maplibregl-ctrl-bottom-right .maplibregl-ctrl-group) {
		margin-bottom: 4rem;
	}
</style>
