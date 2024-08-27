<script lang="ts">
	import * as ml from 'maplibre-gl';
	import { onMount } from 'svelte';

	import { MLMHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { Sites } from '$src/appstate/sites.svelte';
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { sitesDataStats } from '$src/lib/data/stats';
	import { siteGetBeforeDate } from '$src/lib/data/tableHelpers';
	import type { Site } from '$src/lib/types/site';
	import { fmtDate } from '$src/lib/utils';
	import { varlabel, varunits } from '$src/lib/utils/varHelpers';
	import TooltipSiteStats from '../tooltips/TooltipContentSiteStats.svelte';

	type Props = {
		sites: Site[];
		hoveredSite: Site | null;
		mlMap: ml.Map;
		varname: string;
		vardate: Date;
		showRegionTooltip?: boolean;
		hoveredRegion: MLMHoveredFeatureState;
		hoveredRiver: MLMHoveredFeatureState;
	};

	let {
		hoveredSite,
		mlMap,
		sites,
		varname,
		vardate,
		showRegionTooltip = false,
		hoveredRiver = $bindable(new MLMHoveredFeatureState(10)),
		hoveredRegion = $bindable(new MLMHoveredFeatureState())
	}: Props = $props();

	const hoveredSiteStats = $derived(hoveredSite ? sitesDataStats([hoveredSite]) : undefined);

	const hoveredRegionSites = $derived(
		sites.filter((s) => hoveredRegion.id && s.huc10 === hoveredRegion.id)
	);

	const hoveredRegionStats = $derived(
		hoveredRegionSites.length > 0 ? sitesDataStats(hoveredRegionSites) : undefined
	);

	onMount(() => {
		mlMap.on('mousemove', (e: ml.MapMouseEvent) => {
			hoveredRiver.mouseMove(e, ['riverapp-river']);
			hoveredRegion.mouseMove(e, ['riverapp-huc10']);

			if (hoveredRiver.feature || (showRegionTooltip && hoveredRegion.feature) || hoveredSite) {
				tooltip.show(e.originalEvent.x, e.originalEvent.y, true);
				tooltip.content = tooltipContent;
			} else {
				tooltip.hide();
			}
		});
	});

	function selectedDateClosestBeforeDate(site: Site) {
		const date = siteGetBeforeDate(site, 'date', vardate);
		if (date instanceof Date && !isNaN(date.valueOf())) {
			return fmtDate(date);
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
		<i>HUC10: {hoveredRegion.id}</i>
		{#if hoveredRegion.feature}
			<p><b>{Sites.inHuc10(sites, hoveredRegion.feature.id).length}</b> sites</p>
		{/if}
		{#if hoveredRegionStats}
			<TooltipSiteStats stats={hoveredRegionStats} />
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
		{#if hoveredSiteStats}
			<TooltipSiteStats stats={hoveredSiteStats} />
		{/if}
	{/if}
{/snippet}

<style>
	h5 {
		font-weight: 500;
	}
</style>
