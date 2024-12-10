<script lang="ts">
	import { type MapLayersParams } from "$src/lib/types/mapControls";
	import { defaultLayersParams } from "$src/appstate/ui/layers.svelte";
	import MapLibreMap from "../maps/MapLibreMap.svelte";

	// export let layersParams = {
	// 	baseStyleId: 'TOPO',
	// 	riverLayerVisible: true
	// } as MapLayersParams;
</script>

<div style="position: relative; height: 800px; width: 800px">
	<MapLibreMap />
</div>

