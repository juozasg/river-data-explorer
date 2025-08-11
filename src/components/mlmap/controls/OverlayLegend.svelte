<script lang="ts">
	import { d3Interpolator, interpolateDataURL } from '$src/lib/utils/colors';

	import { onMount } from 'svelte';
	import Legend from './Legend.svelte';
	import { roundTickValue } from '$src/lib/utils/chart';

	const { layer }: { layer: string } = $props();

	let doc: Document | undefined = $state();
	onMount(() => {
		doc = document;
	});

	const min = 0;
	const max = 197;
	const unitsLabel = 'ft';


	const interpolator = $derived(d3Interpolator('interpolateTurbo'));
	const dataUrl = $derived(doc && interpolateDataURL(doc, interpolator));

	let legendWidth = $state(0);

	const numTicks = $derived.by(() => {
		const textWidth = 64;
		const calculatedTicks = Math.max(Math.floor(legendWidth / textWidth), 2);
		return calculatedTicks;
	});


	const fmtVarVal = (val: number) => roundTickValue(val, 197);

	const tickFractions = $derived([...Array(numTicks)].map((e, i) => i / (numTicks - 1)));
	const tickValues = $derived(
		tickFractions
			.map((f) => min + f * (max - min))
			.map(fmtVarVal)
			.map((val) => val.toString())
	);

</script>

<Legend
	bind:legendWidth={legendWidth}
	dataUrl={dataUrl!}
	tickValues={tickValues}
	tickFractions={tickFractions}
	unitsLabel={unitsLabel}
/>