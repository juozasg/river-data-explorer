<script lang="ts">
	import type { SitesDataStats } from '$lib/types/analysis';

	const { stats }: { stats: SitesDataStats } = $props();
</script>
<p>{stats.numVariables} variables</p>
<p>{stats.numRecords} records</p>
<div class="timespan">
{#if stats.dateFromLabel}
	<p>from <b>{stats.dateFromLabel}</b></p>
{/if}
{#if stats.dateToLabel && stats.numRecords > 1}
	<p>to <b>{stats.dateToLabel}</b></p>
{/if}
</div>
<style>
	.timespan {
		font-size: 0.8rem;
		display: inline-flex;
		column-gap: 3px;
		/* p { */
			/* } */
	}
	/* p {
		margin: 0 !important;
		padding: 0 !important;
	} */
</style>
