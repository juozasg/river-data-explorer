
<script lang="ts">
	// WIP factoring out the modal
	import { mdiHelpCircleOutline as helpCircle} from '@mdi/js';
	import Modal from './Modal.svelte';

	let showModal = $state(false);

	const closeFn = () => { showModal = false };
	const toggleModalOnH = (e: { key: string; }) => {
		if(e.key === 'H' || e.key === 'h') {
			showModal = !showModal
		}
	}
</script>

<!-- const closeOnEscape = (e: { key: string; }) => {if(e.key === 'Escape') closeFn()}; -->


<svelte:document onkeydown={toggleModalOnH}/>

<a role="button" class="navbar-item help"
		onclick={() => showModal = true}
		tabindex="0">
	<span class="text">Help</span>
	<svg class="" style="width: 36px;" viewBox="0 0 24 24">
		<path d={helpCircle} />
	</svg>
</a>

{#if showModal}
	<Modal {closeFn}/>
{/if}
