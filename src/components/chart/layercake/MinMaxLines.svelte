<script lang="ts">
	import { getContext } from "svelte";

	type Props = {
		domain: [number, number];
		min?: number;
		max?: number;
		color: string;
		label: string;
	};

	const { domain, min, max, color, label }: Props = $props();


	const { xScale, yScale }: { xScale: any, yScale: any } = getContext('LayerCake');



	// $xScale.range() = [0,555]
	// $yScale.range() = [448, 0]
	// $yScale.domain() = [0, 151214]
	// $yScale((151200) = 0.04 //px from the top

	$effect(() => {
		console.log('xScale', $xScale.range(), $xScale.domain());
		console.log('yScale',   $yScale.range(), $yScale.domain(), $yScale);

		console.log('min', min, 'max', max);
	});

	let maxPath = $state("");
	let minPath = $state("");
</script>

{#if max}
	<path class="path-line" d={maxPath} {color}></path>
{/if}

{#if min}
	<path class="path-line" d={minPath} {color}></path>
{/if}
