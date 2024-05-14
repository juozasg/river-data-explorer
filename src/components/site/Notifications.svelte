<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { closeNotification, notifications } from '$src/state/notifications.svelte';
</script>

<div class="notifications">
	{#each notifications as text}
			<div class="notification is-light is-success" in:fly={{ y: 200, duration: 500 }} out:fade={{duration: 200}}>
				<button class="delete" onclick={() => closeNotification(text)}></button>
				{text}
			</div>
		{/each}
</div>


