<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import "$src/styles/map-controls.scss";

	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import InlineBlockIconify from "$src/components/icons/InlineBlockIconify.svelte";
	import DropdownOptions from "./DropdownOptions.svelte";

	let {
		small = false
	}: {
		small?: boolean;
	} = $props();

	let open = $state(false);
	let label = $derived.by(() => {
		switch (layerParams.rasterLayer) {
			case undefined:
				return "No Overlay";
			case "elevation":
				return "Elevation";
			case "lulc":
				return "Land Cover";
			default:
				return "Unknown";
		}
	});
</script>

<DropdownOptions {small} icon="mdi:raster" {label}>
	<hr />
	<span class="section-heading">Raster Overlay</span>
	<label for="raster-none" onclick={() => (layerParams.rasterLayer = undefined)}>
		<input type="radio" id="raster-none" name="raster" value="none" checked={layerParams.rasterLayer == undefined} />
		No Overlay
	</label>
	<label for="raster-elevation" onclick={() => (layerParams.rasterLayer = "elevation")}>
		<input
			type="radio"
			id="raster-elevation"
			name="raster"
			value="elevation"
			checked={layerParams.rasterLayer == "elevation"} />
		Elevation (ft)
	</label>
	<label for="raster-lulc" onclick={() => (layerParams.rasterLayer = "lulc")}>
		<input type="radio" id="raster-lulc" name="raster" value="lulc" checked={layerParams.rasterLayer == "lulc"} />
		Land Use/Land Cover
	</label>

	<!-- <hr /> -->

	<!-- <label for="normalize-scale">
		<input type="checkbox" id="normalize-scale" bind:checked={layerParams.normalizeRasterLegendToVisibleData} />
		Fit elevation overlay scale (legend) to visible data
	</label> -->
</DropdownOptions>

<style>
</style>
