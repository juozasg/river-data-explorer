<script lang="ts">
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import { aremove, varlabel, varunits } from '$src/lib/utils';
	import { onMount } from 'svelte';

	let selectedVariable = $state('temp');

	export const selectedVarname = $derived(selectedVariable);

	let showVarsDropdown = $state(false);

	onMount(() => {
		document.body.addEventListener('click', (e) => {
			showVarsDropdown = false;
		});
	});

	const dropdownToggle = (e: Event) => {
		e.stopPropagation();
		showVarsDropdown = !showVarsDropdown;
	};

	const varnames = aremove(Object.keys(variablesMetadata), 'default');
</script>



<div class="map-control dropdown" class:is-active={showVarsDropdown}>
	<div class="dropdown-trigger">
		<button
			class="button"
			aria-haspopup="true"
			aria-controls="dropdown-menu3"
			onclick={dropdownToggle}
		>
			<span class="dropdown-label">{varlabel(selectedVarname, false)}</span>
			<span class="dropdown-arrow"></span>
		</button>
	</div>
	<div class="dropdown-menu" id="dropdown-menu3" role="menu">
		<div class="dropdown-content">
			<form>
				{#each varnames as varname}
					<div class="dropdown-item">
						<label class="checkbox">
							<input type="radio" name="variable" value={varname} checked={selectedVarname == varname} bind:group={selectedVariable} />
							<span>{varlabel(varname)}</span>
						</label>
					</div>
				{/each}
			</form>
		</div>
	</div>
</div>

<style>
	.map-control {
		height: 40px;


		z-index: 100002;
		position: absolute;
		top: 10px;
		left: 130px;

		&.is-active {
			height: 100%;
		}

		.dropdown-trigger {
			height: 40px;
		}

		.dropdown-menu {
			height: 100%;
			top: 40px;
		}

		.dropdown-content {
			height: calc(100% - 60px);
			overflow-y: scroll;
			z-index: 10002;
			position: relative;

		}



		/*
		.dropdown-menu {
			display: none;
		} */
		/* select {
			font-size: 1.2rem;
			padding: 0.25rem;
			border: 1px solid #ccc;

		} */
	}
</style>
