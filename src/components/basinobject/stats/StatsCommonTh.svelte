<script lang="ts">
	type Props = { includeLast?: boolean; };
	const { includeLast = false }: Props = $props();
</script>


<th>Variable</th>
{#if includeLast}
<th>Last</th>
{/if}
<th>#obs</th>
<th>Min</th>
<th>Max</th>
<th>Mean</th>
<th>Median</th>
<th>Sd</th>
<th>From</th>
<th>To</th>


<style>
	th {
		position: sticky;
		top: 0;
		background-color: white;
		border-bottom: 1px solid #555 !important;
		border-collapse: separate !important;
	}
</style>