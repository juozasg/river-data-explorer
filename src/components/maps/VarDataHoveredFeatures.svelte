<script lang="ts">
	import * as ml from "maplibre-gl";
	import { onMount } from "svelte";

	import { MapFeatureSelectionState } from "$src/appstate/map/featureState.svelte";
	import { tooltip } from "$src/appstate/ui/tooltips.svelte";
	import { sitesDataStats } from "$src/lib/data/stats";
	import { siteGetBeforeDate } from "$src/lib/data/siteTableHelpers";
	import type { Site } from "$src/lib/types/site";
	import { regionIdLabel } from '$src/lib/utils/regions';
	import { fmtDateDMonY } from '$src/lib/utils/date';
	import { queryMouseMoveHover } from "$src/lib/utils/maplibre";
	import { varlabel, varstdmax, varstdmin, varunits } from "$src/lib/utils/varHelpers";
	import TooltipSiteStats from "../tooltips/TooltipContentSiteStats.svelte";
	import { Sites } from "$src/appstate/sites.svelte";
	import { mapMouseLocation } from "$src/appstate/map/mapMouse.svelte";
	import { regionEqual, regionTypes, type RegionFeature } from "$src/appstate/data/features.svelte";

	type Props = {
		sites: Site[];
		site?: Site;
		mlMap: ml.Map;
		varname: string;
		vardate: Date;
		showRegionTooltip?: boolean;
		hoveredRegion: MapFeatureSelectionState;
		hoveredRiver: MapFeatureSelectionState;
		selectedRegion?: MapFeatureSelectionState;
	};

	let {
		site,
		mlMap,
		sites,
		varname,
		vardate,
		showRegionTooltip = false,
		hoveredRiver,
		hoveredRegion,
		selectedRegion
	}: Props = $props();

	const siteStats = $derived(site ? sitesDataStats([site]) : undefined);
	const regionSites = $derived(Sites.forRegionFeature(sites, hoveredRegion.feature));

	// const getStats = (sites: Site[]) => {
	// 	return bm('siteDataStats', () => sitesDataStats(sites));
	// };
	const regionStats = $derived(regionSites.length > 0 ? sitesDataStats(regionSites) : undefined);

	const regionNameLabel = (feature: RegionFeature) => {
		const rt = feature.regionType;
		if (rt == "county") return feature.name + " County";
		// if (rt == "state") return feature.name + " State";
		if (rt == "huc8") return "St. Joseph River Basin";
		return feature.name;
	};



	onMount(() => {
		// mlMap.on("mouseleave", () => {
		// 	if(hoveredRegion.feature) {
		// 		// console.log('not yellow!')
		// 		mlMap.setFeatureState({ source: hoveredRegion?.feature.mlSource, id: hoveredRegion.feature.id }, { willbeselected: false });
		// 	}
		// });
		mlMap.on("mousemove", (e: ml.MapMouseEvent) => {

			hoveredRiver.feature = queryMouseMoveHover(e, ["riverapp-river"], 10);
			hoveredRegion.feature = queryMouseMoveHover(
				e,
				regionTypes.map((rt) => `riverapp-${rt}`),
				10
			);

			if (hoveredRiver.feature || (showRegionTooltip && hoveredRegion.feature) || site) {
				// console.log('show tooltuip', e.originalEvent.x, e.originalEvent.y, site, hoveredRegion.feature, hoveredRiver.feature);
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
				mapMouseLocation.onHover(site, hoveredRegion.feature);
				// console.log(hoveredRegion.feature);
			} else {
				tooltip.hide();
			}

			if((hoveredRegion.feature && !selectedRegion?.feature) ||
			(!site && hoveredRegion.feature && selectedRegion?.feature && !regionEqual(hoveredRegion?.feature, selectedRegion?.feature)))
			 {
				// console.log('make hovered region yellow')
				mlMap.setFeatureState({ source: hoveredRegion?.feature.mlSource, id: hoveredRegion.feature.id }, { willbeselected: true });

				// selectedRegion.feature = hoveredRegion.feature;
			} else if(hoveredRegion.feature) {
				// console.log('not yellow!')
				mlMap.setFeatureState({ source: hoveredRegion?.feature.mlSource, id: hoveredRegion.feature.id }, { willbeselected: false });
			}
		});
	});

	function selectedDateClosestBeforeDate(site: Site) {
		const date = siteGetBeforeDate(site, "date", vardate);
		if (date instanceof Date && !isNaN(date.valueOf())) {
			return fmtDateDMonY(date);
		}
		return "N/A";
	}
</script>

{#snippet variableValueBeforeDate(site: Site)}
	{@const val = siteGetBeforeDate(site, varname, vardate)}
	<p>
		{#if val}
			{varlabel(varname)}: <u><b>{val}</b></u>
			{varunits(varname)} ({selectedDateClosestBeforeDate(site)})
			{#if typeof val == 'number' && varstdmin(varname) !== undefined && varstdmin(varname)! > val}
				<span class="stdbad" style="display: block; color: red">&lt; safe minimum {varstdmin(varname)} {varunits(varname)}</span>
			{/if}
			{#if typeof val == 'number' && varstdmax(varname) !== undefined && varstdmax(varname)! < val}
				<span class="stdbad" style="display: block; color: red"> &gt; safe maximum {varstdmax(varname)} {varunits(varname)}</span>
			{/if}
		{:else}
			{varlabel(varname)}: <span style="color: #777">N/A</span>
		{/if}
	</p>
{/snippet}

{#snippet tooltipContent()}
	{#if hoveredRiver.feature}
		<h5 class="river">River: {hoveredRiver.name}</h5>
		<!-- <i>ID: {hoveredRiver.id}</i> -->
	{/if}
	{#if showRegionTooltip && hoveredRegion.feature}
		<h5 class="region" class:tooltip-section={!!hoveredRiver.feature}>
			Region: {regionNameLabel(hoveredRegion.feature)}
		</h5>
		<p><i>{regionIdLabel(hoveredRegion.feature)}: {hoveredRegion.feature.id}</i></p>
		<p><b>{regionSites.length}</b> sites</p>
		{#if regionStats}
			<TooltipSiteStats stats={regionStats} />
		{/if}
	{/if}

	{#if site}
		<h5 class="site" class:tooltip-section={!!hoveredRiver.feature || !!(showRegionTooltip && hoveredRegion.feature)}>
			Site: {site.name || ""}
		</h5>
		<i>Site ID: {site.id}</i>
		{@render variableValueBeforeDate(site)}
		{#if siteStats}
			<TooltipSiteStats stats={siteStats} />
		{/if}
	{/if}
{/snippet}

<style>
	h5 {
		font-weight: 500;
	}

	.stdbad  {
		padding-top: 3px;
		/* font-size: 0.7rem; */
	}

</style>
