<script lang="ts">
	import MapLibreMap from "$src/components/maps/MapLibreMap.svelte";
	import { type MapLayersParams } from "$src/lib/types/mapControls";
	import { defaultLayersParams } from "$src/appstate/ui/layers.svelte";

	// export let layersParams = {
	// 	baseStyleId: 'TOPO',
	// 	riverLayerVisible: true
	// } as MapLayersParams;
</script>

<div style="position: relative; height: 800px; width: 800px">
	<MapLibreMap />
</div>

