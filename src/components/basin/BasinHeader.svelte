<script lang="ts">
	import type { RegionFeature } from "$src/appstate/data/features.svelte";
	import InlineBlockIconify from "../maps/controls/InlineBlockIconify.svelte";

	type Props = {
		regionFeature?: RegionFeature;
		onClickRegionType?: (regionType: string) => void;
		onClickClose?: () => void;
		regionType?: string;
	};

	const { regionFeature, onClickRegionType, regionType, onClickClose }: Props = $props();
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
			<div class="label">
				<strong>{regionFeature.name}</strong>
				<small>{regionFeature.regionType}&nbsp;{regionFeature.id}</small>
			</div>
			<div class="close" onclick={onClickClose}><InlineBlockIconify icon="lets-icons:close-ring" size="2rem"/></div>
		</div>
	{:else}
		<div class="selected-cue">
			<h4>
				<!-- <InlineBlockIconify icon="lets-icons:arrow-drop-down" size="2rem" /> -->
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
		align-items: center;

		.select-choices {
			display: flex;
			justify-content: space-between;
			align-items: stretch;
			flex-grow: 0;
			flex-shrink: 0;
			align-items: top;
			width: 360px;

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

				display: flex;
				flex-direction: column;
				justify-content: right;
				gap: 4px;
			}

			.close {
				margin-left: 0.5rem;
				:global(path) {
					stroke: var(--color-lightGrey);
				}
			}
			.close:hover {
				cursor: pointer;
				/* background-color: var(--color-hover); */
				:global(path) {
					stroke: var(--font-color);
				}
			}
		}

		.selected-cue h4 {
			display: inline-flex;
			line-height: 1.8rem;
			margin: 0;
		}
	}
</style>
