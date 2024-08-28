<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { sites } from '$src/appstate/sites.svelte';
	import { allVariableStats, sitesDataStats, variableStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';
		import { fmtVarNum, varunits } from '$src/lib/utils/varHelpers';
	import StatsDataTable from '../../website/StatsDataTable.svelte';
	import type ColumnTable from 'arquero/dist/types/table/column-table';
	import { concatTablesAllColumns } from '$src/lib/data/tableHelpers';
	import TooltipVariableBrief from '../../tooltips/TooltipVariableBrief.svelte';
	import VarValueStandards from '../../tooltips/VarValueStandards.svelte';
	import type { MapFeature, MapFeatureSelectionState } from '$src/appstate/map/featureState.svelte';
	import { geomFeatureName } from '$src/appstate/data/geometries.svelte';

	type Props = {
		region: MapFeature;
		onVarClicked: (name: string) => void
	};

	let { onVarClicked, region }: Props = $props();


	// const region = $derived(selectedRegion.feature);
	const sitesInArea = $derived(sites.allEnabled.filter((s) => s.huc10 === region?.id));

	const sitesStats = $derived(sitesDataStats(sitesInArea));
	const sitesInAreaTables = $derived(
		sitesInArea.map((s) => sitesTables.get(s.id)).filter((t) => t)
	) as ColumnTable[];

	const rows: VariableStats[] = $derived.by(() => {
		const combinedTable = concatTablesAllColumns(sitesInAreaTables);

		if (combinedTable.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		const orderedTable = combinedTable.orderby('date').reify();
		return allVariableStats(orderedTable, { errorLabel: sitesInArea.map((s) => s.id).join(', ') });
	});

	let variableTooltip: TooltipVariableBrief | undefined = $state();
</script>

<TooltipVariableBrief bind:this={variableTooltip} />

<div id="region-stats-panel">
	{#if region}
		<h3 class="region-label">
			Region: <span style="font-weight: 400">{region.name}</span>
			<span class="subtitle">{region.sourceType}:{region.id}</span>
		</h3>
	{/if}
	<div class="flex stats-summary">
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

	<StatsDataTable data={rows}>
		<th>Variable</th>
		<th>#obs</th>
		<th>Min</th>
		<th>Max</th>
		<th>Mean</th>
		<th>Med</th>
		<th>Sd</th>
		<th>From</th>
		<th>To</th>

		{#snippet row(r: VariableStats)}
			<td
				class="variable-label"
				onmouseleave={(e: MouseEvent) => variableTooltip?.mouseLeaveVariable(e)}
				onmousemove={(e: MouseEvent) => variableTooltip?.mouseMoveVariable(e, r.varname)}
				onclick={() => onVarClicked(r.varname)}
				>{r.label} {varunits(r.varname, true)}
			</td>
			<td>{r.numObservations}</td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.min}/></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.max}/></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.mean}/></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.median}/></td>
			<td class="stat">{fmtVarNum(r.varname, r.stdDev)}</td>
			<td class="date">{r.dateFromLabel}</td>
			<td class="date">{r.dateToLabel}</td>
		{/snippet}
	</StatsDataTable>
</div>

<style>
	#region-stats-panel {
		height: 100%;

		font-size: 80%;
		display: flex;
		flex-direction: column;
	}

	#region-stats-panel :global {
		.variable-label:hover {
			cursor: pointer;
			text-decoration: underline;
			/* text-decoration-color: #ab00d6; */
			text-decoration-thickness: 2px;
		}

		td.date {
			/* font-size: 75%; */
			min-width: 6.2rem;
		}
	}

	p {
		margin-bottom: 0.2rem !important;
	}

	h3 {
		margin-bottom: 3px;
		/* margin-top: 0.5rem; */

		.subtitle {
			font-size: 0.9rem;
			color: #444;
		}
	}

	h3 :global(.icon) {
		height: 24px;
		vertical-align: -6px !important;
	}

	h3 :global(.blink) {
		animation: blink 1s linear 2;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.stats-summary {
		color: #777;
		margin-bottom: 0 !important;
		font-size: 0.9rem !important;
	}

	.flex {
		font-size: 1rem;
		display: flex;
		flex-wrap: wrap;
		column-gap: 2rem;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		/* padding-right: 1rem; */
	}
</style>
