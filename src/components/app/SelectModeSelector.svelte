<script lang="ts">
	import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/selectionsState.svelte";

	type Props = { target: "1" | "2"; show: boolean };
	let { target, show = false }: Props = $props();

	type WizardStep = "initial" | "catchment" | "region";
	let wizardStep = $state("initial");

	const cancel = () => {
		wizardStep = "initial";
		show = false;
		console.log("cancel");
	};

	const autoMode = () => {
		console.log("Auto mode");
		if (target === "1") {
			basinObject1.clear();
		} else {
			basinObject2.clear();
		}
		mapSelectionMode.mode = "auto";
		cancel();
	};

	const selectSiteMode = () => {
		console.log("Select site mode");
		wizardStep = "initial";
		mapSelectionMode.mode = "site";
		mapSelectionMode.target = target;
		cancel();
	};
</script>

<div>
	<span>Select</span>
	<div class="button-group">
		{#if wizardStep == "initial"}
			<button onclick={autoMode}>Clear</button>
			<button onclick={selectSiteMode}>Sites</button>
			<button onclick={() => (wizardStep = "catchment")}>Catchments</button>
			<button onclick={() => (wizardStep = "region")}>Regions</button>
			<button onclick={cancel}>Cancel</button>
		{:else if wizardStep == "catchment"}
			<button onclick={cancel}>Cancel</button>
			<button>A site catchment</button>
			<button>A river catchment</button>
			<button onclick={cancel}>Cancel</button>
		{:else if wizardStep == "region"}
			<button>Hydrological Unit: Stream (HUC12)</button>
			<button>Hydrological Unit: River (HUC10)</button>
			<button>St. Joseph River Basin (HUC8)</button>
			<button>County</button>
			<button>Indiana</button>
			<button>Michigan</button>
			<button onclick={cancel}>Cancel</button>
		{/if}
	</div>
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

		.button-group {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1rem;
			width: 100%;

			button {
				max-width: 100px;
			}
		}

		button {
			border: 1px solid gray;
			padding: 6px;
			border-radius: 3px;
		}
	}
</style>
