<script lang="ts">
	import Icon from '@iconify/svelte';

	import { selectedRegion } from '$src/appstate/map/featureState.svelte';

	const scrollIntoViewRegionMap = () => {
		const basinRegionsA = window.document.getElementById('basin-regions');
		basinRegionsA?.scrollIntoView({ behavior: 'instant', block: 'start' });
	};
</script>

{#if selectedRegion.feature}
	<div class="basin-workflow-control">
		{#if selectedRegion.feature}
			<div style="width: 100%"><h4>Select site to compare to</h4></div>
			<div style="width: 100%">
				<h3 class="region-label">
					Region: <span style="font-weight: 400">{selectedRegion.name}</span>
					<span class="subtitle">HUC10:{selectedRegion.id}</span>
				</h3>
			</div>
		{/if}
		<div class="change-region-container">
			<button
				class="change-region-button"
				onclick={scrollIntoViewRegionMap}
				class:blink={selectedRegion.feature}
				>Change region <Icon inline={true} class="icon" icon="lets-icons:up" />
			</button>
		</div>
	</div>
{/if}

<style>
	.basin-workflow-control {
		display: flex;
		flex-direction: row;
	}
	h3.region-label {
		font-size: 100%;
		border-left: 6px solid #ab00d6;
		padding-left: 3px;

		.subtitle {
			font-size: 0.6rem;
			color: #444;
		}
	}

	.change-region-container {
		width: 100%;
		text-align: center;
		margin-bottom: 1rem;
	}

	button.change-region-button {
		margin-left: 1rem;
		font-weight: 400;

		background: none !important;
		border: none;
		padding: 0 !important;

		font-size: 1.25rem;
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
