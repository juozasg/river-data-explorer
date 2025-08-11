<script lang="ts">
	import { interpolateVarDataURL } from '$src/lib/utils/colors';
	import { legendFmtVarnameVal, maxLegendTextWidth } from '$src/lib/utils/legend';
	import {
		varCategoryKeys,
		varMax,
		varMin,
		varunits
	} from '$src/lib/utils/varHelpers';
	import { onMount } from 'svelte';
	import Legend from './Legend.svelte';

	const { varname }: { varname: string } = $props();

	let doc: Document | undefined = $state();
	onMount(() => {
		doc = document;
	});

	const dataUrl = $derived(doc && interpolateVarDataURL(doc, varname));

	let legendWidth = $state(0);

	const numTicks = $derived.by(() => {
		const textWidth = maxLegendTextWidth(varname);
		const calculatedTicks = Math.max(Math.floor(legendWidth / textWidth), 2);
		return varCategoryKeys(varname)
			? Math.min(varCategoryKeys(varname)!.length, calculatedTicks)
			: calculatedTicks;
	});


	const fmtVarVal = (val: number) => legendFmtVarnameVal(varname, val);

	const tickFractions = $derived([...Array(numTicks)].map((e, i) => i / (numTicks - 1)));
	const tickValues = $derived(
		tickFractions
			.map((f) => varMin(varname) + f * (varMax(varname) - varMin(varname)))
			.map(fmtVarVal)
	);

	const unitsLabel = $derived(varunits(varname));
</script>

<Legend
	bind:legendWidth={legendWidth}
	dataUrl={dataUrl!}
	tickValues={tickValues}
	tickFractions={tickFractions}
	unitsLabel={unitsLabel}
/>