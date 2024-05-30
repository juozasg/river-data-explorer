<script lang="ts">
	import { selectedArea } from "$src/appstate/map/hoveredSelectedFeatures.svelte";

	const area = $derived(selectedArea);
</script>

<h4>{area.name}</h4>
