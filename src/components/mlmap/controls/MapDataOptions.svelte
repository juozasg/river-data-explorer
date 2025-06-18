<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import "$src/styles/map-controls.scss";

	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import InlineBlockIconify from "$src/components/icons/InlineBlockIconify.svelte";
	import { clickOutside } from "$src/lib/svelte/clickOutside";

	let {
		small = false
	}: {
		small?: boolean;
	} = $props();

	let open = $state(false);

	const onmouseleave = () => (open = false);
	const openDetails = (e: MouseEvent | any) => {
		if (e.sourceCapabilities?.firesTouchEvents) return;
		open = true;
	};

	$effect(() => {
		console.log('open changed', open);

	});
</script>


<div
	class="map-control"
	{onmouseleave}
	aria-label="Data Controls"
	use:clickOutside={() => {
		open = false;
		console.log('clickOutside');

	}}>
	<div class="invisible-hover-target"></div>

	<details {open} class="dropdown mainmenu">
		<summary class:small class="button outline" onmouseenter={openDetails} onclick={() => (open = !open)}>
			<div class="summary-flex">
				<InlineBlockIconify icon="solar:layers-outline" size="1.2rem" />

				{small ? "" : "Data"}
				<DetailsOpenIcon {open} />
			</div>
		</summary>
		<div class="card">
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
			<!-- <label for="hillshade" onclick={() => setBasemapStyleId("HILLSHADE")} style="display: none;">
				<input
					type="radio"
					id="hillshade"
					name="basemap"
					value="HILLSHADE"
					checked={basemapStyleId() == "HILLSHADE"} />
				Hillshade
			</label> -->
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

			<!-- <hr /> -->
		</div>
	</details>
</div>

<style>
	.map-control {
		z-index: 1003;
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
