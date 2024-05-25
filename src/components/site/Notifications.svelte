<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { closeNotification, notifications } from '$src/appstate/ui/notifications.svelte';

	function levelClass(level: string) {
		switch (level) {
			case 'warn':
				return 'is-warning';
			case 'error':
				return 'is-danger';

		}
		return 'is-success';
	}
</script>

<div class="notifications">
	{#each notifications() as n}
		<div
			class="notification is-light {levelClass(n.level)}"
			in:fly={{ y: 200, duration: 500 }}
			out:fade={{ duration: 200 }}
		>
			<button class="delete" onclick={() => closeNotification(n.id)}></button>
			{n.message}
		</div>
	{/each}
</div>
