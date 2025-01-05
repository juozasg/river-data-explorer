<script lang="ts">
	import type { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { regionEqual, type RegionFeature } from "$src/appstate/data/features.svelte";
	import { regionIdLabel } from "$src/lib/utils/regions";
	import { data } from "@maptiler/sdk";
	import InlineBlockIconify from "../maps/controls/InlineBlockIconify.svelte";
	import DataSelectionHints from "./stats/DataSelectionHints.svelte";
	import SitesRegionsAutocomplete from "../maps/controls/SitesRegionsAutocomplete.svelte";
	import type { Site } from "$src/lib/types/site";

	type Props = {
		regionFeature?: RegionFeature;
		dataSelection?: DataSelectionState;
		onClickRegionType?: (regionType: string) => void;
		onClickClose?: () => void;
		regionType?: string;
		selectedSite?: Site;
		onSearchItemSelect?: (item: Site) => void;
	};

	const { regionFeature, onClickRegionType, regionType, onClickClose, dataSelection, selectedSite, onSearchItemSelect }: Props = $props();

	const ySelected = $derived(
		dataSelection && regionFeature && dataSelection.yRegion && regionEqual(dataSelection.yRegion, regionFeature)
	);
	const zSelected = $derived(
		dataSelection && regionFeature && dataSelection.zRegion && regionEqual(dataSelection.zRegion, regionFeature)
	);

	// ySelected={dataSelection.yVar === r.varname && dataSelection.ySite && dataSelection.ySite.id == site.id}
	// 			zSelected={dataSelection.zVar === r.varname && dataSelection.zSite && dataSelection.zSite.id == site.id}
	// 			yHinted={!!r.varname && dataSelection.yVar === r.varname}
	// 			zHinted={!!r.varname && dataSelection.zVar === r.varname}
</script>

<div class="basin-header">
	<!-- <h5 class='select-label'>Select</h5> -->
	<div class="select-choices">
		<a onclick={() => onClickRegionType?.("huc8")} class:bg-primary={regionType == "huc8"}>
			Basin <small>HUC8</small>
		</a>
		<a onclick={() => onClickRegionType?.("state")} class:bg-primary={regionType == "state"}>
			<span>State</span>
		</a>
		<a onclick={() => onClickRegionType?.("county")} class:bg-primary={regionType == "county"}>
			<span>County</span>
		</a>
		<a onclick={() => onClickRegionType?.("huc10")} class:bg-primary={regionType == "huc10"}>
			River <small>HUC10</small>
		</a>
		<a onclick={() => onClickRegionType?.("huc12")} class:bg-primary={regionType == "huc12"}>
			Stream <small>HUC12</small>
		</a>
<!--
		<span class="search">
			<SitesRegionsAutocomplete maxWidth={"50vw"} {selectedSite} {onSearchItemSelect} />
		</span> -->
	</div>
	{#if regionFeature}
		<div class="selected-details">
			<div class="label">
				{#if dataSelection}
					<div class="selection-hints">
						{#if ySelected}
							<div class="y-selection"></div>
						{/if}
						{#if zSelected}
							<div class="z-selection"></div>
						{/if}
					</div>
				{/if}

				<div class="pill">{regionFeature.regionType}</div>
				<strong>{regionFeature.name}</strong>
				<small>{regionIdLabel(regionFeature)} {regionFeature.id}</small>
			</div>
			<div class="close" onclick={onClickClose}><InlineBlockIconify icon="lets-icons:close-ring" size="2rem" /></div>
		</div>
	{:else}
		<div class="selected-cue">
			<h4>
				<InlineBlockIconify icon="lets-icons:arrow-drop-down" size="2rem" />
				Click map region to select
				<InlineBlockIconify icon="lets-icons:arrow-drop-down" size="2rem" />
			</h4>
		</div>
	{/if}
</div>

<style>
	.basin-header {
		padding: 0 0rem;
		margin-bottom: 0rem;

		display: flex;
		justify-content: space-between;

		.selection-hints {
			height: 20px;
			display: inline-block;
			position: relative;
			bottom: -3px;

			pointer-events: none;

			.y-selection {
				display: inline-block;
				background-color: #ab00d6;
				width: 6px;
				height: 100%;
			}

			.z-selection {
				display: inline-block;

				background-color: #00d6ab;
				width: 6px;
				height: 100%;
			}
		}

		.pill {
			display: inline;
		}

		.select-choices {
			display: flex;
			justify-content: space-between;
			align-items: stretch;
			flex-grow: 0;
			flex-shrink: 0;
			width: 340px;

			& > a {
				padding: 5px 3px;
				text-align: center;
				/* height: 100%; */
				line-height: 100%;
				display: block;
				&:hover {
					background-color: var(--color-hover);
					/* text-decoration: none; */
				}

				&.bg-primary {
					color: white;
				}

				span {
					line-height: 2rem;
				}

				& > small {
					font-size: 70%;
				}
				* {
					display: block;
				}
				flex-grow: 1;
			}
		}

		.selected-details {
			display: flex;
			.label {
				flex-basis: content;
				text-align: right;
				padding-right: 0;
				padding-left: 1rem;
				margin-right: 0;
				line-height: 32px;

				/* display: flex; */
				/* flex-direction: column; */
				justify-content: right;
				gap: 2px;

				strong {
					font-size: 1.2rem;
				}
			}

			.close {
				margin-left: 0.3rem;
				:global(path) {
					stroke: var(--font-color);
				}
			}
			.close:hover {
				cursor: pointer;
				/* background-color: var(--color-hover); */
				:global(path) {
					stroke: var(--color-primary);
				}
			}
		}

		.selected-cue {
			flex-grow: 1;
			text-align: left;
		}

		.selected-cue h4 {
			display: inline-flex;
			line-height: 1.8rem;
			margin: 0;
		}
	}
</style>
