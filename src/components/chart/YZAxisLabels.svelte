<script lang="ts">
	import { chartYColor, chartZDarker } from "$src/lib/utils/colors";


	let { yLabel, zLabel }: { yLabel: string; zLabel: string } = $props();
</script>

<div class="y-labels">
	<div class="y-axis-label y-label" style="color:{chartYColor}">
		{@html yLabel}
	</div>
	<div class="z-axis-label y-label" style="color:{chartZDarker}">
		{@html zLabel}
	</div>
</div>

<style>
	.y-labels {
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: -32px;

		font-weight: 500;
		font-size: 0.9rem;
		display: flex;
		justify-content: space-between;

		& :global(.location-label) {
			font-weight: 400;
			font-size: 0.8rem;
		}

		.y-label {
			height: 1.4rem;
			background-color: white;
		}

		.y-axis-label {
			margin-left: 0.2rem;
		}

		.z-axis-label {
			margin-right: 0.1rem;
			text-align: right;
		}
	}

	.y-labels:hover {
		overflow: visible;
	}
</style>
