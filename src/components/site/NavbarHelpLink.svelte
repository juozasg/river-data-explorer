<script lang="ts">
	import { mdiHelpCircleOutline as helpCircle} from '@mdi/js';
	import HelpModal from './HelpModal.svelte';

	let showHelpModal = $state(false);

	const closeHelpModal = () => showHelpModal = false;
	const toggleHelpModalOnH = (e: { key: string; }) => {
		if(e.key === 'H' || e.key === 'h') {
			showHelpModal = !showHelpModal
		}
	}
</script>

<!-- const closeOnEscape = (e: { key: string; }) => {if(e.key === 'Escape') closeHelpModal()}; -->


<svelte:document onkeydown={toggleHelpModalOnH}/>

<a role="button" class="navbar-item help"
		onclick={() => showHelpModal = true}
		tabindex="0">
	<span class="text">Help</span>
	<svg class="" style="width: 36px;" viewBox="0 0 24 24">
		<path d={helpCircle} />
	</svg>
</a>

{#if showHelpModal}
	<HelpModal {closeHelpModal}/>
{/if}
