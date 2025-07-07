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

	let label = $derived.by(() => {
		switch (layerParams.waterflowLayer) {
			case undefined:
				return "No Water Flow";
			case "rtflow":
				return "Water Flow";
			case "rtheight":
				return "Gauge Height";
			case "rtexceedance":
				return "% Exceedance";
			default:
				return "Unknown";
		}
	});
</script>

<DropdownOptions {small} icon="entypo:water" {label} klass="waterflow-options">
	<!-- <div class="waterflow-options"> -->
	<hr />
	<span class="section-heading">Waterflow Symbols</span>
	<label for="waterflow-none" onclick={() => (layerParams.waterflowLayer = undefined)}>
		<input
			type="radio"
			id="waterflow-none"
			name="waterflow"
			value="none"
			checked={layerParams.waterflowLayer == undefined} />
		No water flow
	</label>
	<label for="waterflow-flow" onclick={() => (layerParams.waterflowLayer = "rtflow")}>
		<input
			type="radio"
			id="waterflow-flow"
			name="waterflow"
			value="flow"
			checked={layerParams.waterflowLayer == "rtflow"} />
		Water flow (cfs)
	</label>
	<!-- <label for="waterflow-height" onclick={() => (layerParams.waterflowLayer = "height")}>
		<input
			type="radio"
			id="waterflow-height"
			name="waterflow"
			value="height"
			checked={layerParams.waterflowLayer == "height"} />
		Gauge height (ft)
	</label> -->
	<label for="waterflow-exceedance" onclick={() => (layerParams.waterflowLayer = "rtexceedance")}>
		<input
			type="radio"
			id="waterflow-exceedance"
			name="waterflow"
			value="exceedance"
			checked={layerParams.waterflowLayer == "rtexceedance"} />
		Exceedance (%)
	</label>
	<!-- </div> -->
</DropdownOptions>

<style>
	:global(.waterflow-options .card) {
		width: calc((var(--map-width) / 2) - 10px);
		max-width: 250px;
	}
</style>
