<script lang="ts">
	import MapLibreMap from "$src/components/maps/MapLibreMap.svelte";
	import { defaultLayersParams, type MapLayersParams } from "$src/lib/types/mapControls";

	// export let layersParams = {
	// 	baseStyleId: 'TOPO',
	// 	riverLayerVisible: true
	// } as MapLayersParams;

</script>

<div style="position: relative; height: 1000px; width: 500px">

	<MapLibreMap />
</div>
