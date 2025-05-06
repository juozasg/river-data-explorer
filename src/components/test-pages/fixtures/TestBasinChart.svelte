<script lang="ts">
	import { ChartDataSelectionState } from "$src/appstate/selection/chartDataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { sites } from "$src/appstate/data/sites.svelte";
	import BasinChart from "$src/components/basin/BasinChart.svelte";

	const dataSelection: ChartDataSelectionState = new ChartDataSelectionState();

	$effect(() => {
		console.log('sites', sites.all.length);
		dataSelection.ySite = sites.findBySiteId('sjrbc-1');
		dataSelection.ySite = sites.findBySiteId('invert-1');
		// dataSelection.yVar = 'do';
		dataSelection.yVar = 'invertNarrative';
		dataSelection.zSite = sites.findBySiteId('sjrbc-1');
		// dataSelection.zVar = 'ecoli';
		// dataSelection.zSite = sites.findById('sjrbc-2');
		dataSelection.zVar = 'do';
		dataSelection.zSite = sites.findBySiteId('invert-5');
		dataSelection.zVar = 'invertNarrative';
	});

	const onDateSelect = (d: Date) => {
		console.log('date selected', d);
	};

	$effect(() => {
		console.log('ySite full Table', sitesTables.get(dataSelection.ySite?.siteId || '')?.objects());
		console.log('zSite full Table', sitesTables.get(dataSelection.zSite?.siteId || '')?.objects());
	});
</script>


<div style="position: absolute; top: 3rem; left: 3rem; width: 500px; height:500px">
	<BasinChart
		{dataSelection}
		{onDateSelect}
	/>
</div>