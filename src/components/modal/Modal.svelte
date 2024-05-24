<script lang="ts">
	type Props = { closeFn: () => void }
	let { closeFn }: Props  = $props();

	const closeOnEscape = (e: { key: string; }) => {if(e.key === 'Escape') closeFn()};
</script>


<svelte:document onkeydown={closeOnEscape} />

<div class="modal is-active">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-background"
	onclick={closeFn}></div>

	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">Modal Title</p>
			<button class="delete"
			onclick={closeFn}
			aria-label="close"></button>
		</header>

		<section class="modal-card-body">
			<div class="content">
				<div style="margin-bottom: 1rem">
					<strong>Modal Text...</strong>
				</div>
			</div>
		</section>
	</div>
</div>


<style lang="scss">
	.modal-card-title {
		font-size: 1.8rem;
		font-weight: 600;
	}
</style>