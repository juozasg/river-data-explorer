<script lang="ts">
	import { chartYColor, chartZDarker } from '$src/lib/utils/chart';

	const { yLabel, zLabel }: { yLabel: string; zLabel: string } = $props();
</script>

<div class="y-labels">
	<div class="y-axis-label y-label" style="color:{chartYColor}">
		{yLabel}
	</div>
	<div class="z-axis-label y-label" style="color:{chartZDarker}">
		{zLabel}
	</div>
</div>

<style>
	.y-labels {
		width: 100%;
		overflow: hidden;
		position: absolute;
		top: -19px;

		font-weight: bold;
		font-size: 0.9rem;
		display: flex;
		justify-content: space-between;

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
