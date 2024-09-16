<script lang="ts">
	import * as ml from "maplibre-gl";

	import { siteBeforeVardateValue } from "$src/lib/data/map/helpers/markerHelpers";
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
	};

	// const markers = new sr.Map<number, Marker>();

	let {
		hoveredSite = $bindable(),
		mlMap,
		sites,
		varname,
		vardate,
		selectedSite,
		yVarSite,
		zVarSite,
		emphasizedSites = []
	}: Props = $props();

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = undefined;
	};

	$effect(() => {
		const refs = untrack(() => markerRefs); // dont rerun for each marker change
		const markers = sites.map((s) => markerRefs[s.id]);
		markers.forEach((marker) => {
			if (marker) {
				const val = siteBeforeVardateValue(marker.siteId, varname, vardate);
				if (val === undefined) {
					marker.setColor(ghost);
					return;
				}
				const color = interpolateVarColor(varname, val);
				marker.setColor(color);

				const stdbad = varoutsidestandard(varname, val)
				// console.log('stdbad', stdbad, marker.siteId, val);
				marker.setStdBad(stdbad);
				// marker.class

			}
		});
	});

	const markerRefs: { [key: string]: Marker } = $state({});
</script>

{#if mlMap}
	{#each sites as site (site.id)}
		<Marker
			map={mlMap}
			{markerMouseEnter}
			{markerMouseLeave}
			{site}
			bind:this={markerRefs[site.id]}
			selected={selectedSite && site.id == selectedSite?.id}
			emphasized={emphasizedSites.some((s) => s.id == site.id)}
			isYVar={site.id == yVarSite?.id}
			isZVar={site.id == zVarSite?.id} />
	{/each}
{/if}
