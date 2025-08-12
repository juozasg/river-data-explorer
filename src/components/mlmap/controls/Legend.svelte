<script lang="ts">

	type Props = {
		legendWidth: number;
		dataUrl: string;
		tickValues: string[];
		tickFractions: number[];
		unitsLabel: string;
	};

	let { legendWidth = $bindable(), dataUrl, tickValues, tickFractions, unitsLabel }: Props = $props();
</script>

<!-- <pre style="position: fixed; top: 0; left:0; z-index: 100001">
	nt: {numTicks} {tickValues}
</pre> -->

<div class="map-control" bind:clientWidth={legendWidth}>
	<div class="legend" aria-label="Legend">
		<img class="legend-bar" src={dataUrl} alt="legend color bar"/>

		<div class="legend-labels">
			{#each tickValues as label, i}
				{@const fraction = tickFractions[i]}
				{#if i < tickValues.length - 1}
					<div class="tick-label" style="left: calc({fraction * 100}% - {i}px)">
						<span class="text">{label}<span class="units">{unitsLabel}</span></span>
					</div>
				{:else}
					<div class="tick-label" style="right: 2px">
						<span class="text">{label}<span class="units">{unitsLabel}</span></span>
					</div>
				{/if}
			{/each}
		</div>

		<div class="legend-ticks">
			{#each tickFractions as fraction, i}
				<div class="tick" style="left: calc({fraction * 100}% - {i}px)"></div>
			{/each}
		</div>
	</div>
</div>

<style>
	.map-control {
		flex-grow: 2;


		z-index: 1000;
		padding-left: 0.5rem;
		padding-right: 0.5rem;

		box-shadow: var(--box-shadow);

		.legend {
			box-sizing: border-box;
			position: relative;
			height: 100%;
			width: 100%;
		}

		.legend-ticks {
			width: calc(100% - 1px);
			.tick {
				position: relative;
				display: inline-block;
				bottom: -12px;
				width: 1px;
				height: 12px;
				background-color: #232323;
			}
		}

		.legend-labels {
			width: 100%;
			position: absolute;
			top: 2px;
			left: 0px;
			font-size: 0.7rem;

			.tick-label {
				font-weight: 400;
				position: absolute;
				.units {
					color: #999;
					font-weight: 300;
					/* font-style: italic; */
				}
			}
		}

		.legend-bar {
			display: block;
			height: 6px;
			width: 100%;
			position: absolute;
			bottom: 3px;
		}
	}
</style>
