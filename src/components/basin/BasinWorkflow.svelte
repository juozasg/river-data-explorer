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
	import VarDataMap from '../maps/VarDataMap.svelte';
	import RegionStatsPanel from './stats/RegionStatsPanel.svelte';
	import { type RegionFeature } from '$src/appstate/data/features.svelte';
	import SiteStatsPanel from './stats/SiteStatsPanel.svelte';
	import BasinChart from './BasinChart.svelte';
	import { DataSelectionState } from '$src/appstate/data/dataSelection.svelte';
	import { UTCDayDate } from '$src/lib/utils';
	import { chartYColor, chartZColor } from '$src/lib/utils/colors';
	import { scrollIntoViewRegionMap } from '$src/lib/utils/dom';
	import { isCategoricalVar } from '$src/appstate/variablesMetadata.svelte';
	import RegionTypeTabs from './RegionTypeTabs.svelte';
	import { toggleHideTooltipsKeydown } from '$src/appstate/ui/tooltips.svelte';
	import { copyLngLat } from '$src/lib/copyLngLat';

	document.body.addEventListener("keydown", toggleHideTooltipsKeydown);

	let regionSelectionMap = $state<VarDataMap>();
	let detailsMap = $state<VarDataMap>();
	const dataSelection = new DataSelectionState();

	const updatedRegionSelection = (curr?: RegionFeature, u?: RegionFeature) => {
		toggleSelectedFeatureState(regionSelectionMap?.mlmMap(), curr, u);
		toggleSelectedFeatureState(detailsMap?.mlmMap(), curr, u);

		if (u && detailsMap?.mlmMap()) {
			fitFeatureBounds(detailsMap.mlmMap()!, u);
		}

		// region selection changed, focus details map
		if (u) {
			const regionDetailsA = window.document.getElementById('region-details');
			regionDetailsA?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			detailsMap?.setInternalDate(regionMapVardate);
			detailMapVarname = regionMapVarname;
		}
	};

	function regionMapClick(map: ml.Map, p: ml.PointLike) {
		if (regionSelectionMap?.hoveredSite() || !regionSelectionMap?.hoveredRegion.feature) {
			selectedSite = regionSelectionMap?.hoveredSite();
		}
		console.log(
			'selectedSite',
			selectedSite,
			'selectedRegion',
			selectedRegion.feature,
			'hoveredRegion',
			regionSelectionMap?.hoveredRegion.feature
		);
		if (!regionSelectionMap?.hoveredSite() || !selectedRegion.feature) {
			selectedRegion.feature = regionSelectionMap?.hoveredRegion.feature;
		}
		selectedRiver.feature = regionSelectionMap?.hoveredRiver.feature;
	}

	function detailsMapClick(map: ml.Map, p: ml.PointLike) {
		selectedSite = detailsMap?.hoveredSite();
		// selectedRegion.feature = detailsMap?.hoveredRegion.feature;
		selectedRiver.feature = detailsMap?.hoveredRiver.feature;
	}

	const selectedRegion = new MapFeatureSelectionState(updatedRegionSelection);

	$effect(() => {
		if (!selectedRegion.feature) scrollIntoViewRegionMap();
	});

	const selectedRiver = new MapFeatureSelectionState((c, u) => {}); // TODO: selecting river does something
	let selectedSite = $state<Site>();

	let regionMapVarname = $state('temp');
	let regionMapVardate = $state(UTCDayDate());

	let detailMapVarname = $state('temp');
	let detailMapVardate = $state(UTCDayDate());
	function chartOnDateSelected(d: Date) {
		if (detailsMap) {
			detailsMap.setInternalDate(d);
			detailMapVarname = dataSelection.yVar || dataSelection.zVar || 'temp';
		}
	}

	function regionTableVarClicked(varname: string) {
		detailMapVarname = varname;
	}

	let clickAssignsYAxis = $state(true); // or Z axis


	$effect(() => {

		if(clickAssignsYAxis && dataSelection.yVar && !dataSelection.zVar) {
			clickAssignsYAxis = false;
		}

		if(!clickAssignsYAxis && dataSelection.zVar && !dataSelection.yVar) {
			clickAssignsYAxis = true;
		}

	});

	let siteStatsVarHoverColor = $derived(
		clickAssignsYAxis ? chartYColor + '33' : chartZColor + '33'
	);

	function siteTableVarClicked(varname: string) {
		if (dataSelection.yVar == varname && dataSelection.ySite?.id == selectedSite?.id) {
			dataSelection.yVar = undefined;
			dataSelection.ySite = undefined;
			return;
		}

		if (dataSelection.zVar == varname && dataSelection.zSite?.id == selectedSite?.id) {
			dataSelection.zVar = undefined;
			dataSelection.zSite = undefined;
			return;
		}

		if(isCategoricalVar(varname)) {
			return;
		}

		if (clickAssignsYAxis ) {
			dataSelection.yVar = varname;
			dataSelection.ySite = selectedSite;
		} else {
			dataSelection.zVar = varname;
			dataSelection.zSite = selectedSite;
		}

		clickAssignsYAxis = !clickAssignsYAxis;
	}

	$effect(() => {
		console.log(Object.keys(dataSelection), dataSelection.yVar, dataSelection.zVar, dataSelection.ySite, dataSelection.zSite);
	});
</script>

<div id="basin-regions">
	<h3 id="section-select-area" class="has-text-centered">Select watershed region</h3>

	<RegionTypeTabs />
	<VarDataMap
		bind:this={regionSelectionMap}
		zoom={8}
		{selectedSite}
		{dataSelection}
		onMapClick={regionMapClick}
		{selectedRegion}
		bind:varname={regionMapVarname}
		bind:vardate={regionMapVardate}
		--map-height="70vh"
	/>
</div>

<div id="region-details">
	<ChangeRegionHeader {selectedRegion} />

	<div class="columns" style="height: 100%">
		<div class="column left-column is-half">
			<div class="details" style="opacity: {selectedRegion.feature ? '1' : '0'}">
				<div class="details-top site-selector-map">
					<VarDataMap
						bind:this={detailsMap}
						{selectedSite}
						{dataSelection}
						onMapClick={detailsMapClick}
						{selectedRegion}
						addLayers={addSitesDetailsMapLayers}
						bind:varname={detailMapVarname}
						bind:vardate={detailMapVardate}
						showRegionTooltip={false}
					/>
				</div>
				<div class="details-bottom">
					<BasinChart
						{dataSelection}
						{selectedSite}
						{selectedRegion}
						onDateSelected={chartOnDateSelected}
					/>
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
							hoverColor={siteStatsVarHoverColor}
						/>
					{/if}
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
