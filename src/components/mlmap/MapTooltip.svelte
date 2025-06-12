<script lang="ts">
	import * as ml from "maplibre-gl";
	import { onMount } from "svelte";

	// import { MapFeatureSelectionState } from "$src/appstate/map/_featureState.svelte";
	import { tooltip } from "$src/appstate/ui/tooltips.svelte";
	import { sitesDataStats } from "$src/lib/data/stats";
	import { siteGetBeforeDate } from "$src/lib/data/siteTableHelpers";
	import type { Site } from "$src/lib/types/site";
	import { regionIdLabel } from '$src/lib/utils/regions';
	import { fmtDateDMonY } from '$src/lib/utils/date';
	import { queryMouseMoveHover } from "$src/lib/utils/maplibre";
	import { varlabel, varstdmax, varstdmin, varunits } from "$src/lib/utils/varHelpers";
	import TooltipSiteStats from "../tooltips/TooltipContentSiteStats.svelte";
	import { mapMouseLocation } from "$src/appstate/map/mapMouse.svelte";
	import type { BasinObject } from "$src/appstate/data/basinObject.svelte";
	import { basinFeatureName } from "$src/appstate/data/basinFeatureCollection.svelte";
	import { basinObjectTypeLabel } from "$src/lib/utils/prettyNames";
	// import { regionEqual, regionTypes, type RegionFeature } from "$src/appstate/data/_regionFeatures.svelte";

	type Props = {
		site?: Site;
		regionObject?: BasinObject;
		mlMap: ml.Map;
		varname: string;
		vardate: Date;
		showRegionTooltip?: boolean;
		hoveredObject?: BasinObject;
	};

	let {
		site,
		regionObject,
		mlMap,
		varname,
		vardate,
		showRegionTooltip = false,
		// hoveredRegion,
		// selectedRegion
	}: Props = $props();

	const siteStats = $derived(site ? sitesDataStats([site]) : undefined);

	const regionSites = $derived(regionObject?.isSet ? regionObject.sites : []);
	const regionStats = $derived(regionSites.length > 0 ? sitesDataStats(regionSites) : undefined);

	const regionNameLabel = (object: BasinObject) => {
		if(object.isSet)return basinFeatureName(object.objectType!, object.id!);
		return '';
	};



	onMount(() => {
		mlMap.on("mousemove", (e: ml.MapMouseEvent) => {
			if (regionObject?.isSet || site) {
				// console.log('show tooltuip', e.originalEvent.x, e.originalEvent.y, site, hoveredRegion.feature, hoveredRiver.feature);
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
				// mapMouseLocation.onHover(site, hoveredRegion.feature);
				// console.log(hoveredRegion.feature);
			} else {
				tooltip.hide();
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
	<!-- {#if showRegionTooltip && hoveredRegion.feature}
		<h5 class="region" class:tooltip-section={!!hoveredRiver.feature}>
			Region: {regionNameLabel(hoveredRegion.feature)}
		</h5>
		<p><i>{regionIdLabel(hoveredRegion.feature)}: {hoveredRegion.feature.id}</i></p>
		<p><b>{regionSites.length}</b> sites</p>
		{#if regionStats}
			<TooltipSiteStats stats={regionStats} />
		{/if}
	{/if} -->

	{#if regionObject?.isSet}
		<h5 class="region">
			<span class='type-label'>{basinObjectTypeLabel(regionObject.objectType).toLowerCase()}</span>
			{regionNameLabel(regionObject)}
		</h5>
		<!-- <p><i>{regionIdLabel(regionObject)}: {regionObject.id}</i></p> -->
		<p><b>{regionSites.length}</b> sites</p>
		{#if regionStats}
			<TooltipSiteStats stats={regionStats} />
		{/if}
	{/if}
	{#if site}
		<h5 class="site" class:tooltip-section={regionObject?.isSet}>
			<span class='type-label'>site</span>
			 {site.name || ""}
		</h5>
		<i>({site.siteId})</i>
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

	.type-label {
		display: block;
		font-weight: 800;
		color: var(--color-darkGrey);
		font-variant: small-caps;
		margin-bottom: 4px;
		padding-bottom: 0px;
		font-size: 14px;
		color: var(--stjoe-blue);
	}

	h5.tooltip-section {

		border-top: 1px solid var(--color-lightGrey);
		padding-top: 5px;
		margin-top: 5px;

	}

</style>
