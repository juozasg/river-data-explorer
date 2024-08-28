<script lang="ts">
	import { sitesTables } from '$src/appstate/data/datasets.svelte';
	import { allVariableStats } from '$src/lib/data/stats';
	import type { VariableStats } from '$src/lib/types/analysis';
	import { fmtVarNum, varunits } from '$src/lib/utils/varHelpers';
	import StatsDataTable from '../../website/StatsDataTable.svelte';
	import TooltipVariableBrief from '../../tooltips/TooltipVariableBrief.svelte';
	import VarValueStandards from '../../tooltips/VarValueStandards.svelte';
	import type { Site } from '$src/lib/types/site';

	type Props = {
		onVarClicked: (name: string) => void;
		yVar: string;
		zVar: string;
		site: Site;
	};

	const { onVarClicked, yVar, zVar, site }: Props = $props();

	const table = $derived(site && sitesTables.get(site.id));

	const rows: VariableStats[] = $derived.by(() => {
		if (!table || table.numRows() == 0) return [];
		// dont order empty tables because column date won't exist
		return allVariableStats(table);
	});

	let variableTooltip: TooltipVariableBrief | undefined = $state();

	const selectedY = (varname: string) => varname === yVar;
	const selectedZ = (varname: string) => varname === zVar;
</script>

<TooltipVariableBrief bind:this={variableTooltip} />

<div id="site-stats-panel">
	<h3 class="site-label">
		<div class="color-marker"></div>
		<div class="color-marker"></div>
		Site:<span style="font-weight: 400">{site.name}</span>
		<span class="subtitle">{site.id}</span>
	</h3>
	<StatsDataTable data={rows}>
		<th>Variable</th>
		<th>Last</th>
		<th>#obs</th>
		<th>Min</th>
		<th>Max</th>
		<th>Mean</th>
		<th>Median</th>
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
			<td><VarValueStandards v={r.varname} value={r.lastObservation} /></td>
			<td>{r.numObservations}</td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.min} /></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.max} /></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.mean} /></td>
			<td class="stat"><VarValueStandards v={r.varname} value={r.median} /></td>
			<td class="stat">{fmtVarNum(r.varname, r.stdDev)}</td>
			<td class="date">{r.dateFromLabel}</td>
			<td class="date">{r.dateToLabel}</td>
		{/snippet}
	</StatsDataTable>
</div>

<style>
	#site-stats-panel {
		height: 100%;

		font-size: 80%;
		display: flex;
		flex-direction: column;
	}

	h3 {
		margin-bottom: 3px;
		margin-top: 0.5rem;

		.subtitle {
			font-size: 0.9rem;
			color: #444;
		}
	}

	#site-stats-panel :global {
		.variable-label:hover {
			cursor: pointer;
			text-decoration: underline;
			text-decoration-color: #00af8c;
			text-decoration-thickness: 2px;
			/* text-decoration-style:double; */
		}

		.selected-y {
			border-left: 6px solid #ab00d6;
			padding-left: 3px;
			/* background-color: #ab00d6; */
		}

		.selected-z {
			border-left: 6px solid #00d6ab;
			padding-left: 3px;
			/* background-color: #00af8c; */
		}

		td.date {
			/* font-size: 75%; */
			min-width: 6.2rem;
		}

		td.stat {
			max-width: 3rem;
			overflow-x: hidden;
			padding-right: 0.5rem;
		}

		.site-label {
			border-left: 6px solid #00af8c;
			padding-left: 3px;
		}

		.color-marker {
			display: inline-block;
			position: absolute;

			/* bottom: */
			width: 6px;
			/* height: 10px; */
			height: 100%;
			/* border-radius: 50%; */
			background-color: #ab00d6;
			display: none;
			/* margin-right: 5px; */
		}

		th {
			position: sticky;
			top: 0;
			background-color: white;
			border-bottom: 1px solid #555 !important;
			border-collapse: separate !important;
		}
	}
</style>
