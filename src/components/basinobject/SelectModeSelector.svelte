<script lang="ts">
	import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";

	type Props = { target: "1" | "2"; show: boolean };
	let { target, show = $bindable(false) }: Props = $props();

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

{#if show}
	<div>
		<div class="header">
			<h4>Change Selection:</h4>
			<div class="hline"></div>
		</div>
		<div class="button-group">
			{#if wizardStep == "initial"}
				<button onclick={autoMode}>Clear</button>
				<button onclick={selectSiteMode}>Sites</button>
				<button onclick={() => (wizardStep = "catchment")}>Catchments</button>
				<button onclick={() => (wizardStep = "region")}>Regions</button>
				<button class="cancel" onclick={cancel}>Cancel</button>
			{:else if wizardStep == "catchment"}
				<button>Site catchment</button>
				<button>River catchment</button>
				<button class="cancel" onclick={cancel}>Cancel</button>
			{:else if wizardStep == "region"}
				<button>Hydrological Unit: Stream (HUC12)</button>
				<button>Hydrological Unit: River (HUC10)</button>
				<button>St. Joseph River Basin (HUC8)</button>
				<button>County</button>
				<button>Indiana</button>
				<button>Michigan</button>
				<button class="cancel" onclick={cancel}>Cancel</button>
			{/if}
		</div>
	</div>
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;

		button {
			font-weight: 600;
		}

		button.cancel {
			font-weight: 500;
		}

		.button-group {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 1rem;
			width: 100%;
		}

		.header {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 10px 0;
			/* gap: 1rem; */
			/* margin-bottom: 1rem; */

			h4 {
				/* font-size: 1.5rem; */
				font-weight: 600;
				margin: 0;
				padding-bottom: 6px;
				display: block;
			}
		}
		.hline {
			/* flex-grow: 1; */
			height: 1px;
			width: 100%;
			background-color: var(--color-darkGrey);
		}
	}
</style>
