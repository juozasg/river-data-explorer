<script lang="ts">
	import * as ml from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";

	import { mapMouseLocation } from "$src/appstate/map/mapMouse.svelte";
	import { basemapStyleId } from "$src/appstate/ui/layers.svelte";
	import { tooltip } from "$src/appstate/ui/tooltips.svelte";
	import { transformStyle } from "$src/lib/data/map/helpers/transformMapStyle";
	import { defineGlobal } from "$src/lib/utils";
	import { toggleoffAttribution } from "$src/lib/utils/maplibre";
	import { onMount } from "svelte";

	interface Props {
		zoom?: number;
		center?: ml.LngLatLike;
		// baseStyleId?: keyof typeof basemapStyles;

		mlMap?: ml.Map;
		// onInitialStyleLoaded?: (map: ml.Map) => void;
		// addData: (map: ml.Map) => Promise<void>;
	}

	let {
		mlMap = $bindable(),
		zoom = 8,
		center = [-85.49182, 41.82128],
		// onInitialStyleLoaded
		// baseStyleId = "TOPO",
		// layersParams = defaultLayersParams,
		// addData
	}: Props = $props();

	let mapDiv = $state<HTMLDivElement>();
	export const mapDivElement = () => mapDiv;

	let clientWidth = $state(0);
	// $effect(() => {console.log('CW', clientWidth)});

	const arcgisServicesStyles =
		// 'cached://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles';
		"https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles";
	const apiKey = "AAPK3dfaa40a13c0404983142c26b566596ammsJLVROPRkVaZnrwj6bYIrYdi4FEikx7NZpYg7f5M9XlV2RFL6PgxMA_56IceHv";

	const basemapEnum = "e20332d6d2af43ff8402bb155df01467";
	const basemapStyles = {
		TOPO: `${arcgisServicesStyles}/items/${basemapEnum}?token=${apiKey}`,
		SATELLITE: `${arcgisServicesStyles}/arcgis/imagery/?token=${apiKey}`,
		HILLSHADE: `${arcgisServicesStyles}/arcgis/hillshade/light/?token=${apiKey}`
	};

	let _styleLoaded = $state(false);

	export const styleLoaded = () => {
		return _styleLoaded;
	};

	export const mlmMap = () => mlMap;

	// basemap style change
	$effect(() => {
		if (!mlMap) return;

		const style = basemapStyles[basemapStyleId()];
		mlMap.setStyle(style, { transformStyle });
	});

	onMount(() => {
		const style = basemapStyles[basemapStyleId()];
		mlMap = new ml.Map({
			container: mapDiv!, // container's id or the HTML element to render the map
			style,
			center, // starting position [lng, lat]
			zoom, // starting zoom
			minZoom: 3,
			attributionControl: false
		});

		// mlMap.addControl(new ml.AttributionControl(), 'bottom-right');
		mlMap.addControl(new ml.ScaleControl({ maxWidth: 160, unit: "imperial" }), "bottom-left");
		mlMap.addControl(new ml.NavigationControl(), "bottom-right");
		defineGlobal("mlMap", mlMap);

		// only fires for the initial style, not for map.setStyle
		mlMap.once("idle", () => {
			mlMap!.resize();
			// const style = basemapStyles[basemapStyleId()];
			mlMap!.setStyle(style, { transformStyle }); // force transformStyle to reorder layers

			mlMap!.once("idle", () => {
				_styleLoaded = true;
				// if(onInitialStyleLoaded) onInitialStyleLoaded(mlMap!);
			});
			// });
		});

		// global state for mouse x,y and lonlat location
		// used for C to copy lonlat
		mlMap.on("mousemove", (e): void => {
			mapMouseLocation.onMouseMove(mlMap, e);
		});

		toggleoffAttribution(mapDiv!);
	});

	function onmouseleave() {
		mapMouseLocation.onMouseOut();
		tooltip.hide();
	}
</script>

<div class="map" bind:this={mapDiv} {onmouseleave} role="figure" bind:clientWidth></div>

<style>
	.map {
		height: var(--map-height, 100%);
		/* width: var(--map-width, 100%); */
		z-index: 1;
		& :global(.maplibregl-ctrl-bottom-right .maplibregl-ctrl-group) {
			margin-bottom: 3rem;
		}

		:global(.maplibregl-ctrl-group button + button) {
			border-radius: 0;
		}

		:global(.maplibregl-ctrl-group:not(:empty)) {
			box-shadow: var(--box-shadow);
			border-radius: var(--border-radius);
		}

		:global(.maplibregl-ctrl-scale) {
			margin-bottom: 44px;
		}
	}
</style>
