<script lang="ts">
	import MapLatLonDebug from "./MapLatLonDebug.svelte";

	import type { MapLibreMapProps } from "$src/lib/types/components";

	import { sitesEarliestDate, sitesLatestDate, sitesValidDates } from "$src/lib/data/dateStats";
	import { defaultLayersParams, type MapLayersParams } from "$src/lib/types/mapControls";
	import type { Site } from "$src/lib/types/site";
	import { UTCDayDate } from "$src/lib/utils";
	import DataTools from "./controls/DataTools.svelte";
	import Legend from "./controls/Legend.svelte";
	import DateMultiInput from "./controls/DateMultiInput.svelte";
	import VariableSelector from "./controls/VariableSelector.svelte";
	import { totalRecords } from "$src/appstate/data/datasets.svelte";

	type Props = {
		sites: Site[];
		selectedSite?: Site;
		layersParams: MapLayersParams;
		varname?: string;
		vardate?: Date;
		mapWidth?: number;

		onSearchItemSelect?: (item: Site) => void;
	} & Partial<MapLibreMapProps>;

	let {
		sites,
		selectedSite,
		onSearchItemSelect,
		mapWidth = 400,
		layersParams = $bindable(defaultLayersParams),
		varname = $bindable("ecoli"),
		vardate = $bindable(UTCDayDate())
	}: Props = $props();

	const small = $derived(mapWidth <= 550);

	let validDates: Date[] = $derived.by(() => {
		return sitesValidDates(sites, varname);
	});

	let dateMultiInput = $state<DateMultiInput>();
	export function setInternalDate(d: Date) {
		if (dateMultiInput) dateMultiInput.setInternalDate(d);
	}
</script>

<div class="controls">
	<MapLatLonDebug />
	<div class="top-controls">
		<DataTools {small} maxWidth={mapWidth} {selectedSite} {onSearchItemSelect} bind:layersParams />
		<VariableSelector {small} bind:varname />
		<Legend {varname} />
	</div>
	<DateMultiInput {validDates} bind:vardate bind:this={dateMultiInput} />
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
