<script lang="ts">
	import { page } from '$app/stores';
	const {routeId, slug, title }: any = $props();

	const href = $derived(routeId.replace('[slug]', slug));

	const isSlugRoute = (routeId: string, slug: string) => $page.route?.id === routeId && $page.params.slug === slug;
</script>

<a href="/variables/ph" class="navbar-item" class:navbar-item-selected={isSlugRoute('/variables/[slug]', 'ph')}>
	pH
</a>
<!--

<a href="/variables/ph" class="navbar-item" class:navbar-item-selected={isSlugRoute('/variables/[slug]', 'ph')}>
	pH
</a> -->