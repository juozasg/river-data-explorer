<script lang="ts">
	import * as ml from 'maplibre-gl';

	import { siteVariableColor } from '$src/lib/data/map/helpers/markerHelpers';
	import type { Site } from '$src/lib/types/site';
	import { ghost } from '$src/lib/utils/colors';
	import Marker from './Marker.svelte';

	type Props = {
		sites: Site[];
		hoveredSite: Site | null;
		mlMap: ml.Map;
		varname: string;
		vardate: Date;
	};

	let { hoveredSite = $bindable(null), mlMap, sites, varname, vardate }: Props = $props();

	const markerMouseEnter = (e: MouseEvent, site: Site) => {
		hoveredSite = site;
	};

	const markerMouseLeave = (e: MouseEvent, site: Site) => {
		hoveredSite = null;
	};

	$effect(() => {
		sites; // when this is updated markers are rebuilt
		vardate;
		const markers = mlMap.getContainer().querySelectorAll('.marker');
		// console.log('markers', markers);
		if (markers && markers.length > 0) {
			for (let i = 0; i < markers.length; i++) {
				const m = markers.item(i) as HTMLElement;
				const sid = m.getAttribute('data-site-id') as string;

				const color = siteVariableColor(sid, varname, vardate);
				m.style.setProperty('--color', color);

				if (color === ghost) {
					m.classList.add('ghost');
				} else {
					m.classList.remove('ghost');
				}
			}
		}
	});


</script>

{#if mlMap}
	{#each sites as site (site.id)}
		<Marker map={mlMap} {markerMouseEnter} {markerMouseLeave} {site} />
	{/each}
{/if}

<style>
</style>
