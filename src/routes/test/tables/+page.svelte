<script lang="ts">
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { selectedSite } from "$src/appstate/map/featureState.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import TestDateIndexSearch from "$src/components/website/debug/TestDateIndexSearch.svelte";
	import { fmtDate } from "$src/lib/utils";
	import SiteStatsPanel from "$src/components/basin/SiteStatsPanel.svelte";

	$effect(() => {
		selectedSite.set(sites.all[40]);
	});


</script>

<div id="panel">

	<!-- <TestDateIndexSearch /> -->
	<SiteStatsPanel onVarClicked={ ()=> {}}/>
	<!-- <SiteStatsPanel /> -->
</div>