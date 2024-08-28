<script lang="ts">
	import * as ml from 'maplibre-gl';
	import MapLatLonDebug from './MapLatLonDebug.svelte';
	import VarDataMarkers from './VarDataMarkers.svelte';

	import type { MapLibreMapProps } from '$src/lib/types/components';
	import MapLibreMap from './MapLibreMap.svelte';

	import { MLMHoveredFeatureState } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from '$src/lib/data/dateStats';
	import type { MapLayersParams } from '$src/lib/types/mapControls';
	import type { Site } from '$src/lib/types/site';
	import { UTCDayDate } from '$src/lib/utils';
	import LayerSwitcher from './controls/LayerSwitcher.svelte';
	import Legend from './controls/Legend.svelte';
	import TimeSelector from './controls/TimeSelector.svelte';
	import VariableSelector from './controls/VariableSelector.svelte';
	import VarDataHoveredFeatures from './VarDataHoveredFeatures.svelte';

	type Props = {
		onSelected?: () => void;
	} & Partial<MapLibreMapProps>;

	let { onSelected, ...others }: Props = $props();

	let mlMap = $state<ml.Map>();

	let hoveredRiver = $state(new MLMHoveredFeatureState(10));
	let hoveredRegion = $state(new MLMHoveredFeatureState());
	let hoveredSite: Site | null = $state(null);


	let varname = $state('temp');
	let vardate = $state(UTCDayDate());

	const startDate = $derived(sitesEarliestDate(sites.allEnabled));
	const endDate = $derived(sitesLatestDate(sites.allEnabled));
	let validDates: Date[] = $derived(sitesValidDates(sites.allEnabled, varname));

	let layersParams = $state<MapLayersParams>({
		baseStyleId: 'TOPO',
		riverLayerVisible: true
	});

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style="position: relative; height: 100%">
	<MapLatLonDebug />
	<LayerSwitcher bind:layersParams />
	<VariableSelector bind:varname />
	<TimeSelector {startDate} {endDate} {validDates} bind:vardate />
	<Legend {varname} />
	<MapLibreMap bind:mlMap {layersParams} zoom={7.9} {...others} />
</div>

{#if mlMap}
<VarDataHoveredFeatures
showRegionTooltip={true}
		{mlMap}
		{hoveredSite}
		bind:hoveredRegion
		bind:hoveredRiver
		{varname}
		{vardate}
		sites={sites.allEnabled}
	/>

	<VarDataMarkers {mlMap} {varname} {vardate} sites={sites.allEnabled} bind:hoveredSite />
{/if}

<style>
</style>
