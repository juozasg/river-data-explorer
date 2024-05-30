<script lang="ts">
	import { datasets } from "$src/appstate/data/datasets.svelte";
	import { selectedArea } from "$src/appstate/map/hoveredSelectedFeatures.svelte";
	import { sites as sitesState } from "$src/appstate/sites.svelte";
	import type { Site } from "$src/lib/types/site";

	const area = $derived(selectedArea);
	const sites = $derived(sitesState.selected);
	let varsNumber = $state(0);
	let recordsNumber = $state(0);

	$effect(() => {
		let _varsNumber = 0;
		let _recordsNumber = 0;

		for(const s of sites) {
			const records = datasets.get(s.id);
			_recordsNumber += records?.length || 0;
			const record = records?.[0] || {};
			_varsNumber = Math.max(_varsNumber,  Object.keys(record).length);
		}

		varsNumber = _varsNumber > 0 ? _varsNumber - 1 : 0; // remove 'date' column
		recordsNumber = _recordsNumber;
	});


</script>

<h4>{area.name}</h4>
<p><b>{sites.length}</b> sites</p>
<p><b>{varsNumber}</b> variables</p>
<p><b>{recordsNumber}</b> observations</p>
