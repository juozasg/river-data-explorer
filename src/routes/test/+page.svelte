<script lang="ts">
	const { data } = $props();
	import TestVariables from "$src/components/site/debug/TestVariables.svelte";

</script>

<TestVariables variableMetadata={data.variableMetadata}/>
