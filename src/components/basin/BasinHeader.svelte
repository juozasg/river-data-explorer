<script lang="ts">
	import SelectedRegionHeader from "./stats/SelectedRegionHeader.svelte";

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

	const {
		regionFeature,
		onClickRegionType,
		regionType,
		onClickClose,
		dataSelection,
		onSearchItemSelect
	}: Props = $props();

	const maxWidth = 300;
</script>

<div class="basin-header">
	<div class="select-choices">
		<SitesRegionsAutocomplete maxWidth={maxWidth + "px"} {onSearchItemSelect} />

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
	</div>


	{#if regionFeature}
		<SelectedRegionHeader {regionFeature} {dataSelection} {onClickClose}/>
	{:else}
	{/if}
</div>


<style>
	.basin-header {
		position: relative;
		left: 1.5rem;
		top: 1rem;

		width: calc(100vw - 3rem);
		height: 42px;

		padding: 0 0rem;
		margin-bottom: 0rem;

		display: flex;
		justify-content: space-between;

		.select-choices {
			display: flex;
			justify-content: space-between;
			align-items: stretch;
			flex-grow: 0;
			flex-shrink: 0;
			/* width: 360px; */
			min-width: 360px;
			border: 1px solid green;

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


	}
</style>
