<script lang="ts">
	import { DataSelectionState } from "$src/appstate/data/dataSelection.svelte";
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import BasinChart from "$src/components/basin/BasinChart.svelte";

	const dataSelection: DataSelectionState = new DataSelectionState();

	$effect(() => {
		console.log('sites', sites.all.length);
		dataSelection.ySite = sites.findById('sjrbc-1');
		dataSelection.yVar = 'ecoli';
		// dataSelection.yVar = 'ecoli';
		// dataSelection.zSite = sites.findById('elkhart-1');
		// dataSelection.zVar = 'ecoli';
		dataSelection.zSite = sites.findById('sjrbc-2');
		dataSelection.zVar = 'ecoli';
	});

	const onDateSelected = (d: Date) => {
		console.log('date selected', d);
	};

	$effect(() => {
		console.log('ySite full Table', sitesTables.get(dataSelection.ySite?.id || '')?.objects());
		console.log('zSite full Table', sitesTables.get(dataSelection.zSite?.id || '')?.objects());
	});
</script>


<div style="position: absolute; top: 3rem; left: 3rem; width: 500px; height:500px">
	<BasinChart
		{dataSelection}
		{onDateSelected}
	/>
</div>