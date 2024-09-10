<script lang="ts">
	import { mapMouseLocation } from '$src/appstate/map/mapMouse.svelte';
	import { formatLngLat } from '$src/lib/copyLngLat';
</script>

{#if mapMouseLocation.lngLat}
	<pre class="copy-debug">{formatLngLat(mapMouseLocation.lngLat, 4)} (C to copy)</pre>
{/if}

<style>
	pre.copy-debug {
		position: absolute;
		right: 0;
		top: -20px;
		z-index: 2;
		background: none;
		font-size: 70%;
		pointer-events: none;
	}
</style>
