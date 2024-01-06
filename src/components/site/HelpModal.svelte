
<script lang="ts">
	let { closeHelpModal } = $props<{ closeHelpModal: () => any }>();

	const closeOnEscape = (e: { key: string; }) => {if(e.key === 'Escape') closeHelpModal()};
</script>


<svelte:document onkeydown={closeOnEscape} />

<div class="modal is-active">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-background"
		onclick={closeHelpModal}></div>
	<div class="modal-content">
		<div class="box">
			<div class="content">
				<h2>Help</h2>
				Help content goes here.
			</div>
		</div>
	</div>
	<button class="modal-close is-large"
					aria-label="close"
					onclick={closeHelpModal}>
		Close
		</button>
</div>
