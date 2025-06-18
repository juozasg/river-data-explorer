<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import "$src/styles/map-controls.scss";

	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import InlineBlockIconify from "$src/components/icons/InlineBlockIconify.svelte";

	let {
		small = false
	}: {
		small?: boolean;
	} = $props();

	let open = $state(false);
	let label = $derived.by(() => {
		switch (layerParams.waterflowLayer) {
			case undefined:
				return "No Water Flow";
			case "flow":
				return "Water Flow";
			case "height":
				return "Gauge Height";
			case "exceedance":
				return "% Exceedance";
			default:
				return "Unknown";
		}
	});

	$effect(() => console.log("OverlayOptions label", label));

	const onmouseleave = () => (open = false);
	const openDetails = (e: MouseEvent | any) => {
		if (e.sourceCapabilities?.firesTouchEvents) return;
		open = true;
	};
</script>

<div class="map-control" {onmouseleave} aria-label="Overlay Controls">
	<div class="invisible-hover-target"></div>

	<details {open} class="dropdown mainmenu">
		<summary class:small class="button outline" onmouseenter={openDetails}>
			<div class="summary-flex">
				<InlineBlockIconify icon="solar:layers-outline" size="1.2rem" />

				{small ? "" : label}
				<DetailsOpenIcon {open} />
			</div>
		</summary>
		<div class="card">
			<hr />
			<span class="section-heading">No Overlay</span>
			<label for="waterflow-none" onclick={() => (layerParams.waterflowLayer = undefined)}>
				<input
					type="radio"
					id="waterflow-none"
					name="waterflow"
					value="none"
					checked={layerParams.waterflowLayer == undefined} />
				No water flow
			</label>
			<label for="waterflow-flow" onclick={() => (layerParams.waterflowLayer = "flow")}>
				<input
					type="radio"
					id="waterflow-flow"
					name="waterflow"
					value="flow"
					checked={layerParams.waterflowLayer == "flow"} />
				Water flow (cfs)
			</label>
			<label for="waterflow-height" onclick={() => (layerParams.waterflowLayer = "height")}>
				<input
					type="radio"
					id="waterflow-height"
					name="waterflow"
					value="height"
					checked={layerParams.waterflowLayer == "height"} />
				Gauge height (ft)
			</label>
			<label for="waterflow-exceedance" onclick={() => (layerParams.waterflowLayer = "exceedance")}>
				<input
					type="radio"
					id="waterflow-exceedance"
					name="waterflow"
					value="exceedance"
					checked={layerParams.waterflowLayer == "exceedance"} />
				Exceedance (%)
			</label>

			<!-- <hr /> -->

			<!-- <label for="normalize-scale">
				<input type="checkbox" id="normalize-scale" bind:checked={layerParams.normalizeLegendToVisibleData} />
				Fit overlay scale (legend) to visible data
			</label> -->

			<!-- <hr /> -->
		</div>
	</details>
</div>

<style>
	.map-control {
		z-index: 1002;
		font-size: 22px;

		:global(.inline-block-iconify) {
			position: relative;
			top: 1px;
			left: 2px;
			margin-right: 2px;
		}

		label {
			cursor: pointer;
			white-space: wrap;
		}
	}

	.card {
		width: calc(var(--map-width) - 30px);
		max-width: 500px;
		padding-bottom: 6px !important;
	}
</style>
