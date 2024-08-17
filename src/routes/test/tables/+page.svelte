<script lang="ts">
	import { selectedSite } from "$src/appstate/map/featureState.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import SiteStatsPanel from "$src/components/basin/SiteStatsPanel.svelte";

	$effect(() => {
		selectedSite.set(sites.all[40]);
	});
</script>

<div id="panel">
	{#if selectedSite.site}
		<h5 class="site-label">Site: {selectedSite.site?.name} ({selectedSite.site?.id})</h5>
	{/if}

	<SiteStatsPanel />
	<SiteStatsPanel />
</div>