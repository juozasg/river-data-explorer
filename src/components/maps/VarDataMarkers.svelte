<script lang="ts">
	import * as ml from 'maplibre-gl';
	import * as sr from 'svelte/reactivity';


	import { siteVariableColor } from '$src/lib/data/map/helpers/markerHelpers';
	import type { Site } from '$src/lib/types/site';
	import { ghost } from '$src/lib/utils/colors';
	import Marker from './Marker.svelte';
	import { onMount } from 'svelte';
	import { fmtDateISO, fmtDateValue } from '$src/lib/utils';

	type Props = {
		sites: Site[];
		hoveredSite: Site | null;
		mlMap: ml.Map;
		varname: string;
		vardate: Date;
	};

	// const markers = new sr.Map<number, Marker>();

	let { hoveredSite = $bindable(null), mlMap, sites, varname, vardate }: Props = $props();

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = null;
	};

	onMount(() => {
		console.log('mounted markers', varname, vardate)
	});

	$effect(() => {
		console.log('FX markers  ', varname, vardate);
	});

	$effect(() => {
		const markers = sites.map(s => markerRefs[s.id]);
		markers.forEach(marker => {
			marker.setColor(siteVariableColor(marker.siteId, varname, vardate));
		});
	});

	const markerRefs: {[key: string]: Marker} = {};

</script>

{#if mlMap}
	{#each sites as site (site.id)}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} bind:this={markerRefs[site.id]} emphasized={site.dataset == 'sjrbc'}
		selected={site.id == 'sjrbc-1'}
		selectedYVar={site.id == 'sjrbc-2' || site.id == 'sjrbc-1'}
		selectedZVar={site.id == 'steuben-2'}
		/>
	{/each}
{/if}

<style>
</style>
