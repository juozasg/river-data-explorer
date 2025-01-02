<script lang="ts">
	import * as ml from "maplibre-gl";

		import { siteBeforeVardateValue } from "$src/lib/data/siteTableHelpers";
	import type { Site } from "$src/lib/types/site";
	import Marker from "./Marker.svelte";
	import { untrack } from "svelte";
	import { ghost, interpolateVarColor } from "$src/lib/utils/colors";
	import { varoutsidestandard } from "$src/lib/utils/varHelpers";

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
		ghostSitesVisible = true
	}: Props = $props();

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = undefined;
	};


</script>

{#if mlMap}
	{#each sites as site (site.id)}
		<Marker
			map={mlMap}
			{markerMouseEnter}
			{markerMouseLeave}
			{site}
			{varname}
			{vardate}
			selected={selectedSite && site.id == selectedSite?.id}
			emphasized={emphasizedSites.some((s) => s.id == site.id)}
			isYVar={site.id == yVarSite?.id}
			isZVar={site.id == zVarSite?.id} />
	{/each}
{/if}
