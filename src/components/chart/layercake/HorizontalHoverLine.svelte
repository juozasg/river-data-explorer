<script lang="ts">
		import { findAncestor } from '$src/lib/utils/dom';
	import { onMount, type Snippet } from "svelte";

	type Props = {
		y: number;
		line: Snippet;
		hoveredLine: Snippet;
	};

	const { y, line, hoveredLine }: Props = $props();

	let hovered = $state(false);
	let svgGroup = $state<SVGGElement>();

	onMount(() => {
		const layercakeContainer = findAncestor(svgGroup as any, "layercake-container");
		layercakeContainer?.addEventListener("mousemove", mousemove);

		return () => {
			layercakeContainer?.removeEventListener("mousemove", mousemove);
		};
	});

	function mousemove(event: MouseEvent) {
		hovered = Math.abs(event.layerY - y) < 6;
	}

</script>

<g bind:this={svgGroup}>
	{#if hovered}
		{@render hoveredLine()}
	{:else}
		{@render line()}
	{/if}
</g>
