<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
    routeId: string
    slug: string
    title: string
  }

	const { routeId, slug, title } = $props<Props>();
	const href = $derived(routeId.replace('[slug]', slug));

	const isSlugRoute = (routeId: string, slug: string) => $page.route?.id === routeId && $page.params.slug === slug;
</script>

<a {href} class="navbar-item" class:navbar-item-selected={isSlugRoute(routeId, slug)}>
	{title}
</a>
