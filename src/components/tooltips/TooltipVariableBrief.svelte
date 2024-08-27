<script lang="ts">
	import { tooltip } from "$src/appstate/ui/tooltips.svelte";
	import { tooltipText } from "$src/lib/data/tableHelpers";

	let hoveredVariable: string | undefined = $state();

	export const mouseMoveVariable = (e: MouseEvent, variable: string) => {
		hoveredVariable = variable;
		tooltip.show(e.x, e.y);
		tooltip.content = tooltipContent;

	};

	export const mouseLeaveVariable = (e: MouseEvent) => {
		hoveredVariable = undefined;
		tooltip.hide();
	};
</script>


{#snippet tooltipContent()}
	<p>{tooltipText(hoveredVariable || ' ')}</p>
{/snippet}
