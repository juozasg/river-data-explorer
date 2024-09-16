<script lang="ts">
	import type { RegionFeature } from "$src/appstate/data/features.svelte";

	type Props = {
		regionFeature?: RegionFeature;
		onClickRegionType?: (regionType: string) => void;
		regionType?: string;
	};

	const { regionFeature, onClickRegionType, regionType }: Props = $props();
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
	</div>
	{#if regionFeature}
		<div class="selected-details">
			<strong>{regionFeature.name}</strong>
			<small>{regionFeature.regionType}&nbsp;{regionFeature.id}</small>
		</div>
	{/if}
</div>

<style>
	.basin-header {
		padding: 0 0rem;
		margin-bottom: 0rem;

		display: flex;
		justify-content: space-between;
		align-items: center;

		.select-choices {
			display: flex;
			justify-content: space-between;
			align-items: stretch;
			flex-grow: 1;
			align-items: top;
			min-width: 50%;

			& > a {
				padding: 5px 3px;
				text-align: center;
				/* height: 100%; */
				line-height: 100%;
				display: block;
				&:hover {
					background-color: rgb(0 0 0/5%);
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
				/* margin: 0 3px; */
				/* padding-right: 6px; */
				/* border-right: 1px solid #ccc; */
			}
		}

		.selected-details {
			/* margin-left: auto; */
			/* flex-grow: 1; */
			flex-basis: content;
			text-align: right;
			padding-right: 0;
			padding-left: 1rem;
			margin-right: 0;
		}
	}
</style>
