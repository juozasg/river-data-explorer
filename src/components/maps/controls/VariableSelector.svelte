<script lang="ts">
	import { variablesMetadata } from '$src/appstate/variablesMetadata.svelte';
	import { aremove } from '$src/lib/utils';
	import { varlabel } from '$src/lib/utils/varHelpers';
	import { onMount } from 'svelte';

	const varnames = aremove(Object.keys(variablesMetadata), 'default');
	let { varname = $bindable('temp') }: { varname: string } = $props();


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

	const onclick = (e: Event) => {
		console.log(e);
		e.stopPropagation();
	};
</script>

<div class="map-control dropdown" class:is-active={showVarsDropdown}>
	<div class="dropdown-trigger">
		<button
			class="button"
			aria-haspopup="true"
			aria-controls="dropdown-menu3"
			onclick={dropdownToggle}
		>
			<span class="dropdown-label">{varlabel(varname, false)}</span>
			<span class="dropdown-arrow"></span>
		</button>
	</div>
	<div class="dropdown-menu" id="dropdown-menu3" role="menu">
		<div class="dropdown-content">
			<form>
				{#each varnames as vname}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<div class="dropdown-item" onclick={() => varname = vname}>
						<label class="radio" >
							<input
								type="radio"
								name="variable"
								value={vname}
								checked={varname == vname}
								/>
								<!-- bind:group={varname} -->
							<span>{varlabel(vname, true)}</span>
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

		z-index: 1002;
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
			width: 22rem !important;
		}

		.dropdown-content {
			height: calc(100% - 60px);
			overflow-y: scroll;
			z-index: 10002;
			position: relative;
		}

		div.dropdown-item:hover {
			background-color: hsl(0, 0%, 96%);
			color: hsl(0, 0%, 4%);
		}

		.dropdown-item {
			cursor: pointer;
		}
	}
</style>
