<script lang="ts">
	import VarValueStandards from "$src/components/tooltips/VarValueStandards.svelte";
	import type { VariableStats } from "$src/lib/types/analysis";
	import { fmtVarNum } from "$src/lib/utils/varHelpers";

	type Props = {
		stats: VariableStats;
		includeLast?: boolean;
	};

	let { stats, includeLast = false }: Props = $props();
</script>

{#if includeLast}
	<td>
		<VarValueStandards v={stats.varname} value={stats.lastObservation} />
	</td>
{/if}
<td>{stats.numObservations}</td>
<td class="stat"><VarValueStandards v={stats.varname} value={stats.min} /></td>
<td class="stat"><VarValueStandards v={stats.varname} value={stats.max} /></td>
<td class="stat"><VarValueStandards v={stats.varname} value={stats.mean} /></td>
<td class="stat"><VarValueStandards v={stats.varname} value={stats.median} /></td>
<td class="stat">{fmtVarNum(stats.varname, stats.stdDev)}</td>
<td class="date">{stats.dateFromLabel}</td>
<td class="date">{stats.dateToLabel}</td>

<style>
	td.date {
		/* font-size: 75%; */
		min-width: 6.2rem;
	}

	td.stat {
		max-width: 3rem;
		overflow-x: hidden;
		padding-right: 0.5rem;
	}
</style>
