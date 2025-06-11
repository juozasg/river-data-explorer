<script lang="ts">
	import { sitesDataStats } from "$src/lib/data/stats";
	import type { Site } from "$src/lib/types/site";

	type Props = { sites: Site[] };

	const { sites }: Props = $props();

	// const
	const sitesStats = $derived(sitesDataStats(sites));
</script>

<div class="stats-summary">
	<div class="cell"><p><b>{sitesStats.numSites}</b> sites</p></div>
	<div class="cell"><p><b>{sitesStats.numVariables}</b> variables</p></div>
	<div class="cell"><p><b>{sitesStats.numRecords}</b> records</p></div>
	{#if sitesStats.dateFromLabel && sitesStats.dateToLabel}
		<div class="cell">
			<span class="timespan">
				from <b>{sitesStats.dateFromLabel}</b> to <b>{sitesStats.dateToLabel}</b>
			</span>
		</div>
	{/if}
</div>

<style>

	.stats-summary {
		display: flex;
		flex-wrap: wrap;
		column-gap: 10px;
		justify-content: space-between;

		color: var(--color-data-1);
		margin: 10px 0;
		font-size: 15px !important;

		.cell {
			height: 16px;

			b {
				color: var(--color-darkGrey);
				font-weight: 500;
			}
		}
	}

	:global(.data-1 .stats-summary) {
		color: var(--color-data-1);
	}

	:global(.data-2 .stats-summary) {
		color: var(--color-data-2);
	}
</style>
