<script lang="ts">
	import * as ml from "maplibre-gl";
	import { onDestroy, onMount } from "svelte";
	import type { Site } from "$src/lib/types/site";
	import { layerParams } from "$src/appstate/ui/layers.svelte";
	import { siteRealtimeDatasets } from "$src/appstate/data/datasets.svelte";
	import { tableIndexBeforeDate } from "$src/lib/data/siteTableHelpers";
	import rgb2hex from "rgb2hex";
	import { interpolateVarColor } from "$src/lib/utils/colors";
	import { findBasinFeatureById } from "$src/appstate/data/basinFeatureCollection.svelte";
	import { basinObject1, basinObject2 } from "$src/appstate/selection/objectDataSelections.svelte";

	type Props = {
		map: ml.Map;
		site: Site;
		vardate: Date;
		varname: "rtflow" | "rtexceedance";
	};

	let { map, site, vardate, varname }: Props = $props();

	let marker: ml.Marker | undefined = $state();
	let node: HTMLElement | undefined = $state();

	const table = $derived(siteRealtimeDatasets.get(site.id));

	const valueIndex = $derived(tableIndexBeforeDate(table, vardate));
	const value: number | undefined = $derived(valueIndex !== -1 ? table?.get(varname, valueIndex) : undefined);
	// const color = rgb2hex(interpolateVarColor(varname, value));
	const color = $derived(interpolateVarColor(varname, value));

	const formatValue = (val: number | undefined) => {
		if (val === undefined) return "";
		if (val < 0) return "N/A";
		if (varname === "rtflow") return `${val.toFixed(1)}`;
		if (varname === "rtexceedance") return `${val.toFixed(2)} %`;

		return val.toString();
	};

	$effect(() => {
		if (node && color) {
			// node.style.backgroundColor = color;
			node.style.borderTopColor = color;
			node.style.setProperty("--marker-color", color);
		}
	});

	// $effect(() => {
	// 	console.log('WaterFlowMarker', site.siteId, vardate.toISOString(), varname, value, valueIndex, table);
	// });

	onMount(() => {
		marker = new ml.Marker({ element: node }).setLngLat([site.lon, site.lat]).addTo(map);
	});

	onDestroy(() => {
		if (marker) {
			marker.remove();
			marker = undefined;
		}
	});

	function mouseEnter() {
		const siteCatchment = findBasinFeatureById("site-catchment", site.id);
		// console.log('siteCatchment', siteCatchment);

		if (siteCatchment) {
			const hoveredRegions = map.getSource("riverapp-hovered-flow-regions") as ml.GeoJSONSource;
			hoveredRegions.setData({
				type: "FeatureCollection",
				features: [siteCatchment]
			});
		}
	}

	function mouseLeave() {
		const hoveredRegions = map.getSource("riverapp-hovered-flow-regions") as ml.GeoJSONSource;
		hoveredRegions.setData({
			type: "FeatureCollection",
			features: []
		});
	}

	function onclick() {
		basinObject1.set("site", site.id);
		basinObject2.set("site-catchment", site.id);
		// if (map.getLayer("riverapp-hovered-flow-regions")) {
		// 	const hoveredRegions = map.getSource("riverapp-hovered-flow-regions") as ml.GeoJSONSource;
		// 	hoveredRegions.setData({
		// 		type: "FeatureCollection",
		// 		features: []
		// 	});
		// }

		// if (layerParams.selectedPanel !== "basinObjectData") {
		// 	layerParams.selectedPanel = "basinObjectData";
		// }

		// if (layerParams.selectedBasinObjectTarget !== "1") {
		// 	layerParams.selectedBasinObjectTarget = "1";
		// }
	}
</script>

<!-- <div bind:this={node} class="map-graph-var-hint" style="background-color: white"></div> -->
<div bind:this={node} class="map-graph-var-hint" >
	<svg width="50" height="100" viewBox="0 0 50 100" fill="none" xmlns="http://www.w3.org/2000/svg">

		<path onmouseenter={mouseEnter} onmouseleave={mouseLeave} onclick={onclick}
			d="
				M 0,0
				L 25,50
				L 50,0
				Z
				"
			fill="var(--marker-color)" />
		<path
			d="
				M 0,0
				L 25,50
				L 50,0
				Z
				"
			stroke="#000000"
			stroke-width="1"
			stroke-linejoin="round"
			fill="none" />
	</svg>

	<div class="label">{formatValue(value)}</div>
</div>

<style>
	.map-graph-var-hint {
		position: absolute;

		width: 50px;
		height: 100px;

		.label {
			position: absolute;
			/* border: 1px solid yellow; */
			top: 0px;
			left: 0px;
			min-width: 100%;
			max-width: 200px;
			line-height: 14px;

			padding: 0;
			margin: 0;

			text-align: center;
			font-size: 14px;
			background-color: #000;
			color: white;
			max-height: 14px;
		}
	}
</style>
