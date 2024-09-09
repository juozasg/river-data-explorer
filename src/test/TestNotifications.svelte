<script lang="ts">
	import { notify } from "$src/appstate/ui/notifications.svelte";
	// import Notifications from "$src/components/DelNotifications.svelte";
	notify("Hello, world!");
	setTimeout(() => notify("Hello, warn!", "warn"), 1000);
	setTimeout(() => notify("Hello, ERROR!", "error"), 500);
</script>

Hello notifcations