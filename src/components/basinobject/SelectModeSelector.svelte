<script lang="ts">
	import { basinObject1, basinObject2, mapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import BasinObjectSearchInput from "./BasinObjectSearchInput.svelte";

	type Props = { target: "1" | "2"; show: boolean };
	let { target, show = $bindable(false) }: Props = $props();

	type WizardStep = "initial" | "catchment" | "region";
	let wizardStep = $state("initial");

	const targetBasinObject = $derived(target === "1" ? basinObject1 : basinObject2);

	const cancel = () => {
		wizardStep = "initial";
		show = false;
		console.log("cancel");
	};

	const autoMode = () => {
		console.log("Auto mode");
		targetBasinObject.clear();

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
	<div class="select-mode-selector">
		<div class="header">
			<h4>Change Selection:</h4>
			<div class="hline"></div>
		</div>
		<div class="search-input"><BasinObjectSearchInput /></div>

		<div class="button-group">
			{#if wizardStep == "initial"}
				{#if targetBasinObject.isSelected}
					<button class="clear" onclick={autoMode}>X Clear</button>
				{/if}

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
	.select-mode-selector {
		display: flex;
		flex-direction: column;

		button {
			font-weight: 800;
		}

		button.clear {
			color: var(--color-darkGrey);
		}

		button.cancel {
			font-weight: 500;
		}

		.button-group {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 8px;
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

		.search-input {
			margin-bottom: 12px;
			width: 100%;
			/* border: 1px solid #ccc; */
			/* height: 100%; */
			/* padding: 10px; */
		}
	}
</style>
