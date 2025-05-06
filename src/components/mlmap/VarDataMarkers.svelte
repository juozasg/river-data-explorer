<script lang="ts">
	import * as ml from "maplibre-gl";

	import type { Site } from "$src/lib/types/site";
	import Marker from "./Marker.svelte";

	type Props = {
		sites: Site[];
		mlMap: ml.Map;
		varname: string; // variable in map dropdown
		vardate: Date; // date with time selector
		hoveredSite?: Site;
		selectedSite?: Site;
		yVarSite?: Site;
		zVarSite?: Site;
		emphasizedSites?: Site[];
		ghostSitesVisible?: boolean;
		onSiteHovered?: (site?: Site) => void;
	};

	let {
		hoveredSite = $bindable(),
		mlMap,
		sites,
		varname,
		vardate,
		selectedSite,
		yVarSite,
		zVarSite,
		emphasizedSites = [],
		ghostSitesVisible = true,
		onSiteHovered,
	}: Props = $props();

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;
		// mlmapHovered.site = site;
		if(onSiteHovered) onSiteHovered(site);
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = undefined;
		// mlmapHovered.site = site;
		if(onSiteHovered) onSiteHovered(undefined);
	};
</script>

{#if mlMap}
	{#each sites as site (site.siteId)}
		<!-- {#if site.siteId === 'steuben-1'} -->
		<Marker
			map={mlMap}
			{markerMouseEnter}
			{markerMouseLeave}
			{site}
			{varname}
			{vardate}
			{ghostSitesVisible}
			selected={selectedSite && site.siteId == selectedSite?.siteId}
			emphasized={emphasizedSites.some((s) => s.siteId == site.siteId)}
			isYVar={site.siteId == yVarSite?.siteId}
			isZVar={site.siteId == zVarSite?.siteId} />
		<!-- {/if} -->
	{/each}
{/if}
