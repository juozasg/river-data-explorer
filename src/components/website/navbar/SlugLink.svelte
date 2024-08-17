<script lang="ts">
	import { page } from '$app/stores';
	import type { MarkdownPage } from '$src/lib/types/page';

	interface Props {
    routeId: string
    page: MarkdownPage
  }

	const { routeId, page: mdPage }: Props = $props();
	const href = routeId.replace('[slug]', mdPage.slug);
	const title = mdPage.metadata.title;

	const isSlugRoute = (routeId: string, slug: string) => $page.route?.id === routeId && $page.params.slug === slug;
</script>

<a {href} class="navbar-item" class:navbar-item-selected={isSlugRoute(routeId, mdPage.slug)}>
	{title}
</a>
