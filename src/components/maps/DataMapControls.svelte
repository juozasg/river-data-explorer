<script lang="ts">
	import MapLatLonDebug from "./MapLatLonDebug.svelte";

	import type { MapLibreMapProps } from "$src/lib/types/components";

	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from "$src/lib/data/dateStats";
	import { defaultLayersParams, type MapLayersParams } from "$src/lib/types/mapControls";
	import type { Site } from "$src/lib/types/site";
	import { UTCDayDate } from "$src/lib/utils";
	import DataTools from "./controls/DataTools.svelte";
	import Legend from "./controls/Legend.svelte";
	import TimeSelector from "./controls/TimeSelector.svelte";
	import VariableSelector from "./controls/VariableSelector.svelte";

	type Props = {
		sites: Site[];
		selectedSite?: Site;
		layersParams: MapLayersParams;
		varname?: string;
		vardate?: Date;
		mapWidth?: number;

		searchItemSelect?: (item: Site) => void;
	} & Partial<MapLibreMapProps>;

	let {
		sites,
		selectedSite,
		searchItemSelect,
		mapWidth = 400,
		layersParams = $bindable(defaultLayersParams),
		varname = $bindable("ecoli"),
		vardate = $bindable(UTCDayDate())
	}: Props = $props();

	const small = $derived(mapWidth < 500);

	const startDate = $derived(sitesEarliestDate(sites));
	const endDate = $derived(sitesLatestDate(sites));
	let validDates: Date[] = $derived(sitesValidDates(sites, varname));

	let timeSelector = $state<TimeSelector>();
	export function setInternalDate(d: Date) {
		if (timeSelector) timeSelector.setInternalDate(d);
	}
</script>

<div class="controls">
	<MapLatLonDebug />
	<div class="top-controls">
		<DataTools {small} maxWidth={mapWidth} {selectedSite} {searchItemSelect} bind:layersParams />
		<VariableSelector {small} bind:varname />
		<Legend {varname} />
	</div>
	<!-- <TimeSelector {startDate} {endDate}	 {validDates} bind:vardate bind:this={timeSelector} /> -->
</div>

<style>
	.top-controls {
		position: absolute;
		padding: 10px;
		top: 0;
		left: 0;
		display: flex;
		gap: 10px;
		width: 100%;
	}
</style>
