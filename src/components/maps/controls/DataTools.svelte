<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<!-- svelte-ignore a11y_invalid_attribute -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->

<script lang="ts">
	import SitesRegionsAutocomplete from "./SitesRegionsAutocomplete.svelte";

	// import ArrowDropRight from '$src/components/icons/ArrowDropRight.svelte';
	import DetailsOpenIcon from "$src/components/icons/DetailsOpenIcon.svelte";
	import Icon from "@iconify/svelte";
	import type { Site } from "$src/lib/types/site";
	import { sites } from "$src/appstate/sites.svelte";
	import { isDatasetEnabled, setEnabledDatasets, toggleDatasetEnable } from "$src/appstate/ui/layers.svelte";
	import { type MapLayersParams, defaultLayersParams } from "$src/lib/types/mapControls";

	let {
		maxWidth = 500,
		small = false,
		selectedSite,
		searchItemSelect,
		layersParams = $bindable(defaultLayersParams)
	}: {
		small?: boolean;
		maxWidth?: number;
		selectedSite?: Site;
		searchItemSelect?: (item: Site) => void;
		layersParams: MapLayersParams;
	} = $props();

	let open = $state(false);
	let datasetsOpen = $state(false);

	// $effect(() => {
	// 	if (!open) open = true;
	// 	datasetsOpen = true;
	// });
</script>

<div class="map-control" onmouseleave={() => (open = datasetsOpen = false)}>
	<div class="hover-target"></div>

	<details bind:open class="dropdown mainmenu" onmouseenter={() => (open = true)}>
		<summary class="button outline">
			<div class="icon-spacer"><Icon height="none" width="none" icon="solar:layers-outline" /></div>

			{small ? "" : "Data"}
			<DetailsOpenIcon {open} /></summary>
		<div class="card">
			<!-- DATASETS SUBMENU -->
			<details
				bind:open={datasetsOpen}
				onmouseenter={() => (datasetsOpen = true)}
				onmouseleave={() => (datasetsOpen = false)}
				class="dropdown submenu">
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
			<span class="basemaps-heading">Basemap</span>
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
			<SitesRegionsAutocomplete maxWidth={maxWidth + "px"} {selectedSite} {searchItemSelect} />
		</div>
	</details>
</div>

<style>
	.map-control {
		border-radius: 4px;
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1002;
		font-weight: 300;

		--padding: 0.75rem;

		.hover-target {
			height: 60px;
			width: 100%;
			top: 0;
			right: 0;
			position: absolute;
			/* background-color: aqua; */
			opacity: 0;
		}

		details.dropdown {
			border-radius: inherit;
			summary {
				font-weight: 500;
				padding: 0.75rem 2rem 1rem 2rem;
			}
		}

		.mainmenu > .card {
			margin-top: 4px;
		}

		.card > label {
			display: block;
			padding: var(--padding);
		}

		.card,
		details.submenu {
			margin: 0;
			padding: 0;
			z-index: 1005;

			.card {
				position: absolute;
				left: 12rem;
				top: -2rem;
			}
		}

		details.submenu {
			width: 100%;
			summary {
				font-weight: 500;
				padding: var(--padding);
				padding-left: 2rem;
			}
		}

		.basemaps-heading {
			padding-left: 2rem;
			margin-top: 0.5rem;
			font-weight: 500;
			display: inline-block;
		}

		hr {
			margin: 0;
			padding: 0;
		}

		.dataset-buttons {
			width: 120px;
			margin: 0;
			padding: 0;
			a {
				display: inline-block;
				margin: 0;
				padding: 0;
				padding-top: 1rem;
				padding-bottom: 1rem;

				text-align: center;
				width: 60px;
			}

			a:hover {
				text-decoration: underline;
				cursor: pointer;
			}
		}

		label:hover,
		details.submenu:hover,
		.dataset-buttons a:hover {
			background-color: rgb(0 0 0/5%);
		}

		:global(.details-open-icon, .details-closed-icon) {
			position: relative;
			top: 3px;
			left: 2px;
		}

		.icon-spacer {
			width: 1rem;
			height: 1px;
			position: relative;
			display: inline-block;
			:global(.iconify) {
				position: absolute;
				/* top: 4px; */
				/* left: -2px; */
				top: -15px;
				left: -12px;
				width: 2rem;
				height: 2rem;
				margin-right: 0.5rem;
			}
		}

		details.submenu {
			summary {
				cursor: pointer;
				list-style: none;
			}
		}

		.dropdown {
			background-color: white;
		}

		details > summary {
			list-style: none;
		}
		details > summary::-webkit-details-marker {
			display: none;
		}
	}
</style>
