<script lang="ts">
	import MapLatLonDebug from "./MapLatLonDebug.svelte";

	import { sitesValidDates } from "$src/lib/data/dateStats";
	import type { Site } from "$src/lib/types/site";
	import MapDataOptions from "./controls/MapDataOptions.svelte";
	import DateMultiInput from "./controls/DateMultiInput.svelte";
	import VariableSelector from "./controls/VariableSelector.svelte";
	import OverlayOptions from "./controls/OverlayOptions.svelte";
	import WaterflowOptions from "./controls/WaterflowOptions.svelte";
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import VarLegend from "./controls/VarLegend.svelte";
	import OverlayLegend from "./controls/OverlayLegend.svelte";
	import OverlayLulcLegend from "./controls/OverlayLulcLegend.svelte";

	type Props = {
		sites: Site[];
		selectedSite?: Site;
		varname?: string;
		vardate: Date;
		mapWidth?: number;
	};

	let { sites, mapWidth = 400, varname = $bindable("ecoli"), vardate = $bindable() }: Props = $props();

	const small = $derived(mapWidth <= 550
	|| (layerParams.rasterLayer != undefined && mapWidth < 700)
	|| (layerParams.waterflowLayer != undefined && mapWidth < 700)
	|| (layerParams.rasterLayer != undefined &&  layerParams.waterflowLayer != undefined && mapWidth < 900)
);

	let validDates: Date[] = $derived.by(() => {
		return sitesValidDates(sites, varname);
	});

	let dateMultiInput = $state<DateMultiInput>();
	// export function setDate(d: Date) {
	// 	// if (dateMultiInput) dateMultiInput.setDate(d);
	// }
</script>

<div class="controls">
	<MapLatLonDebug />
	<div class="top-controls">
		<MapDataOptions {small} />
		<VariableSelector {small} bind:varname />
		<VarLegend {varname} />
	</div>

	<div class="top-controls overlay-controls">
		<OverlayOptions {small} />
		{#if layerParams.rasterLayer}
			{#if layerParams.rasterLayer == "elevation"}
				<OverlayLegend layer={layerParams.rasterLayer} />
			{:else if layerParams.rasterLayer == "lulc"}
				<OverlayLulcLegend {mapWidth} />
								<!-- <OverlayLegend layer={layerParams.rasterLayer} /> -->

			{/if}
		{/if}

		<WaterflowOptions {small} />
		{#if layerParams.waterflowLayer}
			<VarLegend varname={layerParams.waterflowLayer} />
		{/if}
	</div>
	<div class="bottom-controls">
		<DateMultiInput {validDates} bind:vardate bind:this={dateMultiInput} />
	</div>
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

	.bottom-controls {
		position: absolute;
		padding: 10px;
		bottom: 0;
		left: 0;
		display: flex;
		gap: 10px;
		width: 100%;
	}

	.overlay-controls {
		top: 36px;
		z-index: 1002;
	}
</style>
