<script lang="ts">
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import SiteStatsPanel from "$src/components/basin/stats/SiteStatsPanel.svelte";
	import TestDateIndexSearch from "$src/components/website/debug/TestDateIndexSearch.svelte";
	import { fmtMonDY } from "$src/lib/utils";

	// $effect(() => {
	// 	selectedSite.set(sites.all[40]);
	// });


</script>

<div id="panel">

	<!-- <TestDateIndexSearch /> -->
	<!-- <SiteStatsPanel onVarClicked={ ()=> {}}/> -->
	<!-- <SiteStatsPanel /> -->
</div>