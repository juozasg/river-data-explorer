<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import InlineBlockIconify from "./InlineBlockIconify.svelte";

	import "$src/styles/map-controls.scss";

	import SitesRegionsAutocomplete from "./SitesRegionsAutocomplete.svelte";

	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import { sites } from "$src/appstate/sites.svelte";
	import { isDatasetEnabled, setEnabledDatasets, toggleDatasetEnable } from "$src/appstate/ui/layers.svelte";
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import { type MapLayersParams } from "$src/lib/types/mapControls";
	import { defaultLayersParams } from "$src/appstate/ui/layers.svelte";
	import type { Site } from "$src/lib/types/site";

	let {
		maxWidth = 500,
		small = false,
		selectedSite,
		onSearchItemSelect,
		layersParams = $bindable(defaultLayersParams)
	}: {
		small?: boolean;
		maxWidth?: number;
		selectedSite?: Site;
		onSearchItemSelect?: (item: Site) => void;
		layersParams: MapLayersParams;
	} = $props();

	let open = $state(false);
	let datasetsOpen = $state(false);

	const onmouseleave = () => (open = false);
	const openDetails = (e: MouseEvent | any) => {
		if (e.sourceCapabilities?.firesTouchEvents) return;
		open = true;
	};

	const openDatasets = (e: MouseEvent | any) => {
		if (e.sourceCapabilities?.firesTouchEvents) {
			// console.log('ignore touch')
			return;
		}
		datasetsOpen = true;
	};
</script>

<div class="map-control" {onmouseleave}>
	<div class="invisible-hover-target"></div>

	<details {open} class="dropdown mainmenu">
		<summary class:small class="button outline" onmouseenter={openDetails}>
			<div class="summary-flex">
				<InlineBlockIconify icon="solar:layers-outline" size="1.2rem" />

				{small ? "" : "Data"}
				<DetailsOpenIcon {open} />
			</div>
		</summary>
		<div class="card">
			<!-- DATASETS SUBMENU -->
			<details open={datasetsOpen} class="dropdown submenu"
			onmouseenter={openDatasets}
			onmouseleave={() => (datasetsOpen = false)}
			>
				<summary class="outline">Datasets<DetailsOpenIcon open={datasetsOpen} /></summary>
				<div class="card">
					{#each sites.allDatasets as dsname}
						<label for={dsname}>
							<input
								type="checkbox"
								id={dsname}
								checked={isDatasetEnabled(dsname)}
								onclick={() => toggleDatasetEnable(dsname)} />
							<tt>{dsname}</tt>
						</label>
					{/each}

					<hr />
					<div class="dataset-buttons">
						<a class="all-button" onclick={() => setEnabledDatasets(sites.allDatasets)}>All</a><a
							class="none-button"
							onclick={() => setEnabledDatasets([])}>None</a>
					</div>
				</div>
			</details>
			<hr />
			<span class="section-heading">Basemap</span>
			<label for="topo" onclick={() => (layersParams.baseStyleId = "TOPO")}>
				<input type="radio" id="topo" name="basemap" value="TOPO" checked={layersParams.baseStyleId == "TOPO"} />
				Topographic
			</label>
			<label for="satellite" onclick={() => (layersParams.baseStyleId = "SATELLITE")}>
				<input
					type="radio"
					id="satellite"
					name="basemap"
					value="SATELLITE"
					checked={layersParams.baseStyleId == "SATELLITE"} />
				Satellite
			</label>
			<hr />
			<label for="river">
				<input type="checkbox" id="river" bind:checked={layersParams.riverLayerVisible} />
				Mainstem and tributaries
			</label>

			<hr />
			<SitesRegionsAutocomplete maxWidth={maxWidth + "px"} {selectedSite} {onSearchItemSelect} />
		</div>
	</details>
</div>

<style>
	.map-control {
		z-index: 1002;

		:global(.inline-block-iconify) {
			position: relative;
			top: 1px;
			left: 2px;
			margin-right: 2px;
		}

		tt {
			font-size: 0.85em;
		}

		.submenu :global(.details-icon) {
			position: relative;
			top: 3px;
			left: 3px;
		}

		label {
			cursor: pointer;
		}
	}
</style>
