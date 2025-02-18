<script lang="ts">ChartDataSelectionesTables } from "$src/appstate/data/datasets.svelte";
	import { sites } from "$src/appstate/sites.svelte";
	import BasinChart from "$src/components/basin/BasinChart.svelte";

	const dataSelectChartDataSelectionaSelectChartDataSelectionNarrative';
		dataSelection.zSite = sites.findById('sjrbc-1');
		// dataSelection.zVar = 'ecoli';
		// dataSelection.zSite = sites.findById('sjrbc-2');
		dataSelection.zVar = 'do';
		dataSelection.zSite = sites.findById('invert-5');
		dataSelection.zVar = 'invertNarrative';
	});

	const onDateSelect = (d: Date) => {
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
		{onDateSelect}
	/>
</div>