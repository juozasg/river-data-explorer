<script lang="ts">
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import { fmtVarNum, varunits } from '$src/lib/utils';
	import { on } from 'svelte/events';

	const { v, value }: { v: string; value: number | undefined } = $props();

	const md = variablesMetadata[v];
	const standartsMin = md?.standards?.min;
	const standartsMax = md?.standards?.max;

	const exceedsMin = $derived(value && typeof standartsMin == 'number' && value < standartsMin);
	const exceedsMax = $derived(value && typeof standartsMax == 'number' && value > standartsMax);

	export const onmousemove = (e: MouseEvent) => {
		if(exceedsMin || exceedsMax) {
		tooltip.show(e.x, e.y);
		tooltip.content = tooltipContent; }
	};

	export const onmouseleave = (e: MouseEvent) => {
		tooltip.hide();
	};
</script>

<span {onmousemove} {onmouseleave} class:exceeds-min={exceedsMin} class:exceeds-max={exceedsMax}>
	{fmtVarNum(v, value)}
</span>

{#snippet tooltipContent()}
	{#if exceedsMax}
		<p>Above maximum {standartsMax} {varunits(v, false)}</p>
	{:else if exceedsMin}
		<p>Below minimum {standartsMin} {varunits(v, false)}</p>
	{/if}
{/snippet}

<style>
	span.exceeds-min {
		color: #ff3860;;
		text-decoration: underline;
	}

	span.exceeds-max {
		color: #ff3860;
	}
</style>
