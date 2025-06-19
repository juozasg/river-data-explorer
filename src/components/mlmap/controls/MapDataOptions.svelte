<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import "$src/styles/map-controls.scss";

	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import DropdownOptions from "./DropdownOptions.svelte";

	let {
		small = false
	}: {
		small?: boolean;
	} = $props();
</script>

<DropdownOptions {small} icon="solar:layers-outline" label="Data">
	<hr />
	<span class="section-heading">Basemap</span>
	<label for="topo" onclick={() => (layerParams.basemapStyleId = "TOPO")}>
		<input type="radio" id="topo" name="basemap" value="TOPO" checked={layerParams.basemapStyleId == "TOPO"} />
		Topographic
	</label>
	<label for="satellite" onclick={() => (layerParams.basemapStyleId = "SATELLITE")}>
		<input
			type="radio"
			id="satellite"
			name="basemap"
			value="SATELLITE"
			checked={layerParams.basemapStyleId == "SATELLITE"} />
		Satellite
	</label>
	<label for="hillshade" onclick={() => (layerParams.basemapStyleId = "HILLSHADE")}>
		<input
			type="radio"
			id="hillshade"
			name="basemap"
			value="HILLSHADE"
			checked={layerParams.basemapStyleId == "HILLSHADE"} />
		Hillshade
	</label>
	<hr />
	<label for="river">
		<input type="checkbox" id="river" bind:checked={layerParams.riverLayerVisible} />
		Mainstem and tributaries
	</label>
	<label for="hide-ghosts">
		<input type="checkbox" id="hide-ghosts" bind:checked={layerParams.ghostSitesVisible} />
		Show sites with no data records
	</label>
	<label for="normalize-scale">
		<input type="checkbox" id="normalize-scale" bind:checked={layerParams.normalizeLegendToVisibleData} />
		Fit site variables scale (legend) to visible data
	</label>
</DropdownOptions>

<style>
</style>
