<script lang="ts">
	import { tooltip } from '$src/appstate/ui/tooltips.svelte';
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
		import { fmtVarNum, varunits } from '$src/lib/utils/varHelpers';

	const { v, value }: { v: string; value: number | undefined } = $props();

	const md = variablesMetadata[v];
	const standardsMin = md?.standards?.min;
	const standardsMax = md?.standards?.max;

	const exceedsMin = $derived(value && typeof standardsMin == 'number' && value < standardsMin);
	const exceedsMax = $derived(value && typeof standardsMax == 'number' && value > standardsMax);

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
		<p>Above maximum {standardsMax} {varunits(v)}</p>
	{:else if exceedsMin}
		<p>Below minimum {standardsMin} {varunits(v)}</p>
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
