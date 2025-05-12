<script lang="ts">
	import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/selectionsState.svelte";

	type Props = { target: "1" | "2" };
	export const { target }: Props = $props();

	const autoMode = () => {
		console.log("Auto mode");
		if (target === "1") {
			basinObject1.clear();
		} else {
			basinObject2.clear();
		}
		mapSelectionMode.mode = "auto";
	};

	const selectSiteMode = () => {
		console.log("Select site mode");
		mapSelectionMode.mode = 'site';
		mapSelectionMode.target = target;
	};
</script>

<div>
	<span>I want to select: </span>
	<select>
		<option onclick={autoMode}>Clear selection and select by clicking</option>
		<option onclick={selectSiteMode}>A site</option>
		<option>A site catchment</option>
		<option>A river catchment</option>
		<option>Hydrological Unit: Stream (HUC12)</option>
		<option>Hydrological Unit: River (HUC10)</option>
		<option>The entire basin (HUC8)</option>
		<option>County</option>
		<option>Indiana</option>
		<option>Michigan</option>
	</select>
</div>


<style>
	div {
		display: flex;
		flex-direction: column;
		span {
			display: block;
			margin-top: 1rem;
			margin-bottom: 1rem;
			font-size: 1.5rem;
		}

		select {
			display: block;
			padding-left: 1rem;

			font-size: 1.5rem;
			margin-left: 1rem;
			width: 90%;
		}
	}
</style>
