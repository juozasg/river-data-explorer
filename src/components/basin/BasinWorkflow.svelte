<script lang="ts">
	import * as ml from 'maplibre-gl';
	import ChangeRegionHeader from './ChangeRegionHeader.svelte';

	import {
		MapFeature,
		MapFeatureSelectionState,
		toggleSelectedFeatureState
	} from '$src/appstate/map/featureState.svelte';
	import { addSitesDetailsMapLayers } from '$src/lib/data/map/mapData/sitesMapDataLayers';
	import type { Site } from '$src/lib/types/site';
	import { fitFeatureBounds } from '$src/lib/utils/maplibre';
	import RegionTypeTabs from '../../routes/basin/RegionTypeTabs.svelte';
	import VarDataMap from '../maps/VarDataMap.svelte';

	let regionSelectionMap = $state<VarDataMap>();
	let detailsMap = $state<VarDataMap>();

	const updatedRegionSelection = (curr?: MapFeature, u?: MapFeature) => {
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
	$effect(() => {
		// if(geometries.get('huc10') && detailsMap?.mlmComponent?.dataLoaded()) selectedRegion.feature = new MapFeature('riverapp-huc10', "0405000118");
	});

	const selectedRiver = new MapFeatureSelectionState((c, u) => {}); // TODO: selecting river does something
	let selectedSite = $state<Site>();
	let yVarSite = $state<Site>();
	let zVarSite = $state<Site>();
	let yVar: string = $state('temp');
	let zVar: string = $state('do');
</script>

<div id="basin-regions">
	<h3 id="section-select-area" class="has-text-centered">Select watershed region</h3>

	<RegionTypeTabs />

	<!-- <AreaSelectorMap onSelected={onSelectedArea} --map-height="70vh" zoom={8.35} /> -->

	<VarDataMap
		bind:this={regionSelectionMap}
		zoom={8.35}
		{selectedSite}
		{yVarSite}
		{zVarSite}
		mapClick={regionMapClick}
		{selectedRegion}
		--map-height="70vh"
	/>
</div>

<div id="region-details">
	<ChangeRegionHeader {selectedRegion} />

	<!-- <div class="columns" style="height: 100%" class:is-hidden={!selectedRegion.feature}> -->
	<div class="columns" style="height: 100%">
		<div class="column left-column is-half">
			<div class="details">
				<div class="details-top site-selector-map">
					<VarDataMap
						bind:this={detailsMap}
						{selectedSite}
						{yVarSite}
						{zVarSite}
						mapClick={detailsMapClick}
						{selectedRegion}
						addLayers={addSitesDetailsMapLayers}
						showRegionTooltip={false}
					/>
					<!-- --map-height="" -->
				</div>
				<div class="details-bottom">
					<!-- {#if !selectedSite.site}
					<div class="placeholder" class:is-hidden={!!selectedSite.site}>
						<h2>Click a site marker on the map to select</h2>
					</div>
					{/if}
					<BasinChart {yVar} {zVar} /> -->
				</div>
			</div>
		</div>
		<div class="column right-column is-half">
			<div class="details">
				<div class="details-top">
					<!-- <RegionStatsPanel onVarClicked={(varname: string) => yVar = varname} /> -->
				</div>
				<div class="details-bottom">
					<!-- <SiteStatsPanel onVarClicked={(varname: string) => zVar = varname} {yVar} {zVar}/> -->
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
