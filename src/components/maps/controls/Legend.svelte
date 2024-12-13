<script lang="ts">
	import { roundTickValue } from '$src/lib/utils/chart';
	import { interpolateVarDataURL } from '$src/lib/utils/colors';
	import {
		varcategories,
		varcatilegend,
		varmax,
		varmin,
		varrange,
		varunits
	} from '$src/lib/utils/varHelpers';
	import { onMount } from 'svelte';

	const { varname }: { varname: string } = $props();

	let doc: Document | undefined = $state();
	onMount(() => {
		doc = document;
	});

	const dataUrl = $derived(doc && interpolateVarDataURL(doc, varname));
	const maxLegendTextWidth = $derived.by(() => {
		if (varcategories(varname)) {
			const labels = varcategories(varname)?.map((v, i) => varcatilegend(varname, i));
			if (!labels || labels.length === 0) return 30;
			const longestLabel = labels.reduce((a, b) => (a.length > b.length ? a : b));
			// console.log('longestLabel', longestLabel, longestLabel.length);
			return (longestLabel.length + 3) * 12;
		}
		const maxValueNumChars = varmax(varname).toString().length;
		const unitNumChars = varunits(varname).length;
		return (maxValueNumChars + unitNumChars + 3) * 8;
	});

	let legendWidth = $state(0);

	const numTicks = $derived.by(() => {
		const calculatedTicks = Math.max(Math.floor(legendWidth / maxLegendTextWidth), 2);
		return varcategories(varname)
			? Math.min(varcategories(varname)!.length, calculatedTicks)
			: calculatedTicks;
	});

	const tickFractions = $derived([...Array(numTicks)].map((e, i) => i / (numTicks - 1)));

	const fmtVarname = (v: number) =>
		varcategories(varname)
			? varcatilegend(varname, Math.round(v))
			: roundTickValue(v, varrange(varname), false);
	const tickValues = $derived(
		tickFractions
			.map((f) => varmin(varname) + f * (varmax(varname) - varmin(varname)))
			.map(fmtVarname)
	);
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
						<span class="text">{label}{varunits(varname)}</span>
					</div>
				{:else}
					<div class="tick-label" style="right: 2px">
						<span class="text">{label}{varunits(varname)}</span>
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
		flex-grow: 1;


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
				/* background-color: #62B3C6; */
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
				position: absolute;
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
