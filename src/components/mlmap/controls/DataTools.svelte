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
		maxWidth = 500,
		small = false,
	}: {
		small?: boolean;
		maxWidth?: number;
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

<div class="map-control" {onmouseleave} aria-label="Data Controls">
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


			<!-- <details open={datasetsOpen} class="dropdown submenu"
			onmouseenter={openDatasets}
			onmouseleave={() => (datasetsOpen = false)}
			>
				<summary class="outline">Datasets<DetailsOpenIcon open={datasetsOpen} /></summary>
				<div class="card">
					{#each _sites.allDatasets as dsname}
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
						<a class="all-button" onclick={() => setEnabledDatasets(_sites.allDatasets)}>All</a><a
							class="none-button"
							onclick={() => setEnabledDatasets([])}>None</a>
					</div>
				</div>
			</details> -->
			<hr />
			<span class="section-heading">Basemap</span>
			<label for="topo" onclick={() => layerParams.basemapStyleId = "TOPO"}>
				<input type="radio" id="topo" name="basemap" value="TOPO" checked={layerParams.basemapStyleId == 'TOPO'} />
				Topographic
			</label>
			<label for="satellite" onclick={() => layerParams.basemapStyleId = "SATELLITE"}>
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

			<hr />
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
