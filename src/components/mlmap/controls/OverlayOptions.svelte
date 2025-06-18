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
		switch(layerParams.rasterLayer) {
			case undefined: return "No Overlay";
			case "elevation": return "Elevation";
			case "lulc": return "Land Cover";
			default: return "Unknown";
		}
	});

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
			<label for="raster-none" onclick={() => (layerParams.rasterLayer = undefined)}>
				<input type="radio" id="raster-none" name="raster" value="none" checked={layerParams.rasterLayer == undefined} />
				No Overlay
			</label>
			<label for="raster-elevation" onclick={() => (layerParams.rasterLayer = 'elevation')}>
				<input type="radio" id="raster-elevation" name="raster" value="elevation" checked={layerParams.rasterLayer == 'elevation'} />
				Elevation (ft)
			</label>
			<label for="raster-lulc" onclick={() => (layerParams.rasterLayer = 'lulc')}>
				<input type="radio" id="raster-lulc" name="raster" value="lulc" checked={layerParams.rasterLayer == 'lulc'} />
				Land Use/Land Cover
			</label>

			<hr />


			<label for="normalize-scale">
				<input type="checkbox" id="normalize-scale" bind:checked={layerParams.normalizeRasterLegendToVisibleData} />
				Fit elevation overlay scale (legend) to visible data
			</label>

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
