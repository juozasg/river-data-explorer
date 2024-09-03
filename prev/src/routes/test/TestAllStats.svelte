<script lang="ts">
	import { sitesTables } from "$src/appstate/data/datasets.svelte";
	import { allVariableStats } from "$src/lib/data/stats";
	import { concatTablesAllColumns } from "$src/lib/data/tableHelpers";


	$effect(() => {
		const combinedTable = concatTablesAllColumns([...sitesTables.values()]);
		console.log('ALL DATA', combinedTable.data())
		if(combinedTable.numRows() == 0) return;
		const orderedTable = combinedTable.orderby('date').reify();
		console.log('ALL STATS', allVariableStats(orderedTable, { errorLabel: '' }));
	});
</script>
