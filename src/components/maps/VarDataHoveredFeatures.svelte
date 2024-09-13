<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import { MapFeatureSelectionState } from '$src/appstate/map/featureState.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import { siteGetBeforeDate } from '$src/lib/data/tableHelpers';
	import type { Site } from '$src/lib/types/site';
	import { fmtDateDMonY, fmtMonDY } from '$src/lib/utils';
	import { queryMouseMoveHover } from '$src/lib/utils/maplibre';
	import { varlabel, varunits } from '$src/lib/utils/varHelpers';
	import TooltipSiteStats from '../tooltips/TooltipContentSiteStats.svelte';
	import { Sites } from '$src/appstate/sites.svelte';

	type Props = {
		sites: Site[];
		hoveredSite?: Site;
		mlMap: ml.Map;
		varname: string;
		vardate: Date;
		showRegionTooltip?: boolean;
		hoveredRegion: MapFeatureSelectionState;
		hoveredRiver: MapFeatureSelectionState;
	};

	let {
		hoveredSite,
		mlMap,
		sites,
		varname,
		vardate,
		showRegionTooltip = false,
		hoveredRiver,
		hoveredRegion
	}: Props = $props();

	const siteStats = $derived(hoveredSite ? sitesDataStats([hoveredSite]) : undefined);

	const regionSites = $derived(Sites.forRegionFeature(sites, hoveredRegion.feature));
	// $effect(() => {
	// 	console.log(hoveredRegion.feature, regionSites, regionStats)
	// });
	const regionStats = $derived(regionSites.length > 0 ? sitesDataStats(regionSites) : undefined);

	onMount(() => {
		mlMap.on('mousemove', (e: ml.MapMouseEvent) => {
			hoveredRiver.feature = queryMouseMoveHover(e, ['riverapp-river'], 10);
			hoveredRegion.feature = queryMouseMoveHover(e, ['riverapp-huc10']);

			if (hoveredRiver.feature || (showRegionTooltip && hoveredRegion.feature) || hoveredSite) {
				// console.log('show tooltuip', e.originalEvent.x, e.originalEvent.y, hoveredSite, hoveredRegion.feature, hoveredRiver.feature);
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
			} else {
				tooltip.hide();
			}
		});
	});
fmtMonDY
	function selectedDateClosestBeforeDate(site: Site) {
		const date = siteGetBeforeDate(site, 'date', vardate);
		if (date instanceof Date && !isNaN(date.valueOf())) {
			return fmtDateDMonY(date);
		}
		return 'N/A';
	}

</script>

{#snippet variableValueBeforeDate(site: Site)}
	{@const val = siteGetBeforeDate(site, varname, vardate)}
	<p>
		{#if val}
			{varlabel(varname)}: <u><b>{val}</b></u>
			{varunits(varname)} ({selectedDateClosestBeforeDate(site)})
		{:else}
			{varlabel(varname)}: <span style="color: #888">N/A</span>
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
			Region: {hoveredRegion.name}
		</h5>
		<i>HUC10: {hoveredRegion.feature.id}</i>
		<p><b>{regionSites.length}</b> sites</p>
		{#if regionStats}
			<TooltipSiteStats stats={regionStats} />
		{/if}
	{/if}

	{#if hoveredSite}
		<h5
			class="site"
			class:tooltip-section={!!hoveredRiver.feature ||
				!!(showRegionTooltip && hoveredRegion.feature)}
		>
			Site: {hoveredSite.name || ''}
		</h5>
		<i>Site ID: {hoveredSite.id}</i>
		{@render variableValueBeforeDate(hoveredSite)}
		{#if siteStats}
			<TooltipSiteStats stats={siteStats} />
		{/if}
	{/if}
{/snippet}

<style>
	h5 {
		font-weight: 500;
	}
</style>
