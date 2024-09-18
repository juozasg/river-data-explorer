<script lang="ts">
	import { tooltip } from "$src/appstate/ui/tooltips.svelte";
	import { variablesBriefMarkdown } from "$src/appstate/variablesMetadata.svelte";
	import { tooltipText } from "$src/lib/data/tableHelpers";

	let hoveredVariable: string | undefined = $state();

	export const mouseMoveVariable = (e: MouseEvent, varname: string) => {
		hoveredVariable = varname;
		if (variablesBriefMarkdown.get(varname)) {
			tooltip.show(e.x, e.y - 5);
			tooltip.content = tooltipContent;
		}
	};

	export const mouseLeaveVariable = (e: MouseEvent) => {
		hoveredVariable = undefined;
		tooltip.hide();
	};
</script>

{#snippet tooltipContent()}
	<p>{tooltipText(hoveredVariable || " ")}</p>
{/snippet}

<style>
	p {
		line-height: 1.1;
	}
</style>
