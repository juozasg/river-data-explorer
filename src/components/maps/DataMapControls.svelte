<script lang="ts">
	import MapLatLonDebug from "./MapLatLonDebug.svelte";

	import type { MapLibreMapProps } from "$src/lib/types/components";

	import { sitesValidDates } from "$src/lib/data/dateStats";
	import { type MapLayersParams } from "$src/lib/types/mapControls";
	import { defaultLayersParams } from "$src/appstate/ui/layers.svelte";
	import type { Site } from "$src/lib/types/site";
	import { UTCMinus5NoonDate } from '$src/lib/utils/dates';
	import DataTools from "./controls/DataTools.svelte";
	import DateMultiInput from "./controls/DateMultiInput.svelte";
	import Legend from "./controls/Legend.svelte";
	import VariableSelector from "./controls/VariableSelector.svelte";

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
		vardate = $bindable(UTCMinus5NoonDate())
	}: Props = $props();

	const small = $derived(mapWidth <= 550);

	let validDates: Date[] = $derived.by(() => {
		return sitesValidDates(sites, varname);
	});

	let dateMultiInput = $state<DateMultiInput>();
	export function setDate(d: Date) {
		if (dateMultiInput) dateMultiInput.setDate(d);
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
