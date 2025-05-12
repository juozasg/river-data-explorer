<script lang="ts">
	import type { BasinObject } from "$src/appstate/selection/selectionsState.svelte";

	type Props = {basinObject: BasinObject};
	export const {basinObject}: Props = $props()


</script>


{#if basinObject.isSelected()}
	<div>
		<div>{basinObject.id}</div>
		<div>{basinObject.objectType}</div>
		<div><button onclick={() => basinObject.clear()}>Clear</button></div>
	</div>
{:else }
	<div>
		<span>Nothing selected</span>
	</div>

{/if}
