<script lang="ts">
	import * as ml from "maplibre-gl";

	import { rtSites } from "$src/appstate/data/sites.svelte";
	import WaterFlowMarker from "./WaterFlowMarker.svelte";

	type Props = {
		map: ml.Map;
		varname: "rtflow" | "rtexceedance";
		vardate: Date; // epoch seconds
	};

	let { map, vardate, varname }: Props = $props();

	// setInterval(() => {
	// 	const t = vardate.getTime() - 1000 * 60 * 15;
	// 	vardate = new Date(t);
	// 	// console.log("vardate", vardate);
	// }, 10);

</script>

<div class="markers">
	{#each rtSites() as site}
		<WaterFlowMarker {map} {site} {vardate} {varname}  />
	{/each}
</div>


<style>
	.markers {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
