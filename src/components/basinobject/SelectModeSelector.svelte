<script lang="ts">
	import { basinObject1, basinObject2, mapSelectionMode, type MapSelectionMode } from "$src/appstate/selection/basinObjectSelection.svelte";
	import BasinObjectSearch from "./BasinObjectSearch.svelte";

	type Props = { target: "1" | "2"; show: boolean };
	let { target, show = $bindable(false) }: Props = $props();

	type WizardStep = "initial" | "catchment" | "region";
	let wizardStep = $state("initial");

	const targetBasinObject = $derived(target === "1" ? basinObject1 : basinObject2);

	const cancel = () => {
		wizardStep = "initial";
		if(targetBasinObject.isSet) {
			show = false;
		}
		// console.log("cancel", targetBasinObject, targetBasinObject.isSelected);
	};

	const setSelectMode = (mode: MapSelectionMode) => {
		// console.log("setSelectMode", mode);
		wizardStep = "initial";

		mapSelectionMode.mode = mode;
		mapSelectionMode.target = target;
		cancel();
	};

	const autoMode = () => {
		targetBasinObject.clear();
		setSelectMode("auto");
	};

	const selectBasinObject = (objectType: 'huc8' | 'indiana' | 'michigan') => {
		// console.log("selectBasinObject", objectType);
		targetBasinObject.setNamedObject(objectType);

		cancel();
		setSelectMode("auto");
	};


</script>

{#if show}
	<div class="select-mode-selector">
		<div class="header">
			<div class="hline"></div>
		</div>
		<div class="object-search"><BasinObjectSearch {target} /></div>



		<div class="button-group">
			{#if wizardStep == "initial"}
				{#if targetBasinObject.isSet}
					<button class="clear" onclick={autoMode}>X Clear</button>
				{/if}

				<button onclick={() => setSelectMode('site')}>Sites</button>
				<button onclick={() => (wizardStep = "catchment")}>Catchments</button>
				<button onclick={() => (wizardStep = "region")}>Regions</button>
				{#if targetBasinObject.isSet}
					{@render cancelButton()}
				{/if}

			{:else if wizardStep == "catchment"}
				<button onclick={() => setSelectMode('site-catchment')}>Site catchment</button>
				<button onclick={() => setSelectMode('river-catchment')}>River catchment</button>
				{@render cancelButton()}
			{:else if wizardStep == "region"}
				<button onclick={() => setSelectMode('huc12')}>Hydrological Unit: Stream (HUC12)</button>
				<button onclick={() => setSelectMode('huc10')}>Hydrological Unit: River (HUC10)</button>
				<button onclick={() => selectBasinObject('huc8')}>St. Joseph River Basin (HUC8)</button>
				<button onclick={() => setSelectMode('county')}>Counties</button>
				<button onclick={() => selectBasinObject('indiana')}>Indiana</button>
				<button onclick={() => selectBasinObject('michigan')}>Michigan</button>
				{@render cancelButton()}
			{/if}
		</div>
	</div>
{/if}

{#snippet cancelButton()}
	<button class="cancel" onclick={cancel}>Cancel</button>
{/snippet}

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

		.object-search {
			margin-bottom: 12px;
			width: 100%;
			position: relative;
			/* border: 1px solid #ccc; */
			/* height: 100%; */
			/* padding: 10px; */
		}
	}
</style>
