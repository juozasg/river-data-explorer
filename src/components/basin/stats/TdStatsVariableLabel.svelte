<script lang="ts">
	import DataSelectionHints from "./DataSelectionHints.svelte";

	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import TooltipVariableBrief from "../../tooltips/TooltipVariableBrief.svelte";

	interface Props extends HTMLAttributes<HTMLTableCellElement> {
		ySelected?: boolean;
		zSelected?: boolean;
		yHinted?: boolean;
		zHinted?: boolean;
		children: Snippet;
		varGraphButtonClick: (name: string, axis: "y" | "z") => void;
		varname: string;
		canBeGraphed?: boolean;
	}

	let {
		children,
		varname,
		varGraphButtonClick,
		ySelected = false,
		zSelected = false,
		yHinted = false,
		zHinted = false,
		canBeGraphed = true,
		...attribs
	}: Props = $props();

	let variableTooltip: TooltipVariableBrief | undefined = $state();
</script>

<TooltipVariableBrief bind:this={variableTooltip} />

<td
	{...attribs}
	class="variable-label"
	onmouseleave={(e: MouseEvent) => variableTooltip?.mouseLeaveVariable(e)}
	onmousemove={(e: MouseEvent) => variableTooltip?.mouseMoveVariable(e, varname)}>
	<div class="flexblock">
		<DataSelectionHints {ySelected} {yHinted} {zSelected} {zHinted} />

		<div class="text-block">
			{@render children()}
			<div class="graph-buttons" class:is-hidden={!canBeGraphed}>
				<a
					class={['graph-button y', {'selected': ySelected}]}

					onclick={(e) => {
						varGraphButtonClick(varname, "y");
						e.stopPropagation();
					}}>Y</a>
				<a
					class={['graph-button z', {'selected': zSelected}]}
					onclick={(e) => {
						varGraphButtonClick(varname, "z");
						e.stopPropagation();
					}}>Z</a>
			</div>
		</div>
	</div>
</td>

<style>
	.variable-label:hover {
		cursor: pointer;
		/* background-color: var(--hover-color, #ccc); */
		background-color: #ccc;
	}

	.variable-label {
		padding-left: 0 !important;
	}

	.flexblock {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
	}

	.text-block {
		position: relative;
		width: 100%;
	}

	.graph-buttons {
		top: -3px;
	}

</style>
