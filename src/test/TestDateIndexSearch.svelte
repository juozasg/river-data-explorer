<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { selectedSite } from '$src/appstate/map/featureState.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { tableIndexBeforeDate } from '$src/lib/data/tableHelpers';
	import { fmtMonDY } from '$src/lib/utils';

	const table = $derived(sitesTables.get('sjrbc-1')?.slice(0, 1));
	$effect(() => {
		if(!table) return;
		console.log('table', table?.objects());

		table?.objects().forEach((obj, i) => {
			console.log(i, fmtMonDY(obj['date']));

		});
		let d = new Date();
		d = new Date('2011-03-25');
		console.log('found index for', fmtMonDY(d), tableIndexBeforeDate(table, d));
	});
</script>

<pre>
		{JSON.stringify(table?.objects(), null, 2)}
	</pre>
