								<script lang="ts">
	import type { MapFeatureSelectionState } from '$src/appstate/map/featureState.svelte';
	import { scrollIntoViewRegionMap } from '$src/lib/utils/dom';
	import Icon from '@iconify/svelte';

	type Props = {
		selectedRegion: MapFeatureSelectionState;
		blink?: boolean;
	};

	let { selectedRegion, blink = true }: Props = $props();


</script>

{#if selectedRegion.feature}
	<div class="basin-workflow-control">

		<div class="change-region-container">
			<button
				class="change-region-button"
				onclick={() => selectedRegion.feature = undefined}
				class:blink={blink && selectedRegion.feature}
				><Icon height="none" class="icon icon-left" icon="lets-icons:arrow-drop-up" />Change region <Icon height="none" class="icon" icon="lets-icons:arrow-drop-up" />
			</button>
		</div>
	</div>
{/if}

<style>

.change-region-container :global(.icon) {
		height: 56px !important;
		width: 56px !important;
		position: absolute;
		bottom: -26px;
	}

	.change-region-container :global(.icon-left) {

		left: -56px;
	}

	.basin-workflow-control {
		display: flex;
		flex-direction: row;
	}

	.change-region-container {
		width: 100%;
		text-align: center;
		margin-bottom: 1rem;
	}

	button.change-region-button {
		position: relative;
		margin-left: 1rem;
		font-weight: 600;

		background: none !important;
		border: none;
		padding: 0 !important;

		font-size: 1.75rem;
		line-height: 1rem;
		color: #485fc7;
		cursor: pointer;
		text-decoration: dotted underline;
		cursor: pointer;
	}

	.change-region-button :global(.icon) {
		height: 24px;
		vertical-align: -6px !important;
	}

	.change-region-button.blink {
		animation: blink 1s linear 2;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
