<script lang="ts">
	import type { RegionFeature } from "$src/appstate/data/features.svelte";

	type Props = {
		regionFeature?: RegionFeature;
		onClickRegionType?: (regionType: string) => void;
	};

	const { regionFeature, onClickRegionType }: Props = $props();
</script>

<div class="basin-header">
	<!-- <h5 class='select-label'>Select</h5> -->
	<div class="select-choices">
		<a onclick={() => onClickRegionType?.("huc8")}>Basin <small>HUC8</small></a>
		<a onclick={() => onClickRegionType?.("state")}><span>State</span></a>
		<a onclick={() => onClickRegionType?.("county")}><span>County</span></a>
		<a onclick={() => onClickRegionType?.("huc10")}>River <small>HUC10</small></a>
		<a onclick={() => onClickRegionType?.("huc12")}>Stream <small>HUC12</small></a>
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
		margin-bottom: 0.5rem;

		/* .select-label {
			margin-right: 1rem;
		} */
		/* background-color: #f0f0f0; */
		/* padding: 1rem; */
		display: flex;
		justify-content: space-between;
		align-items: center;
/*
		.select-huc-12 {
			border-right: none; */
		/* } */

		.select-choices {
			/* flex-grow: 0; */
			display: flex;
			justify-content: space-between;
			align-items: stretch;
			/* gap: 1.5rem; */
			flex-grow: 1;
			align-items: top;

			& > a {
				padding: 3px 3px;
				text-align: center;
				/* height: 100%; */
				line-height: 100%;
				display: block;
				&:hover {
					background-color: #ccc;
					text-decoration: none;
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
