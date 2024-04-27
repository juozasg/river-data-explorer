<script lang="ts">
  import NavbarBasin from './navbar/Basin.svelte';


	import { page, navigating } from '$app/stores';
	import type { MarkdownPage } from '$src/lib/types/page';
	import NavbarSlugLink from './navbar/SlugLink.svelte';

	interface Props {
    regionPages: MarkdownPage[]
    variablePages: MarkdownPage[]
  }

	const { regionPages, variablePages }: Props = $props();

	const isRoute = (routeId: string) => $page.route?.id === routeId

	let burgerActive = $state(false);

	$effect(() => {
		if($navigating) {
			burgerActive = false;
		}
	});
</script>


<nav class="navbar is-fixed-top is-transparent" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
      <img src="/sjrbc-logo.png" alt="SJRBC Logo">
    </a>

		<a role="button" class="navbar-burger"
					class:is-active={burgerActive}
					onclick={() => burgerActive = !burgerActive}
			 		aria-label="menu" aria-expanded="false" tabindex="0">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>

	<div class="navbar-menu"
				class:is-active={burgerActive}>
		<div class="navbar-start">
			<a href="/" class="navbar-item" class:navbar-item-selected={isRoute('/')}>
				Home
			</a>

			<a href="/about" class="navbar-item" class:navbar-item-selected={isRoute('/about')}>
				About
			</a>

			<NavbarBasin/>

							<!-- <div class="navbar-dropdown is-boxed">
									<a href="/regions/counties" class="navbar-item" class:navbar-item-selected={false}>Counties</a>
									<a href="/regions/counties" class="navbar-item" class:navbar-item-selected={false}>Rivers</a>
									<a href="/regions/counties" class="navbar-item" class:navbar-item-selected={false}>Streams</a>
									<a href="/regions/counties" class="navbar-item" class:navbar-item-selected={false}>Indiana</a>
									<a href="/regions/counties" class="navbar-item" class:navbar-item-selected={false}>Michigan</a>
							</div> -->
			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link" class:navbar-item-selected={isRoute('/variables/[slug]')}>
					Variables
				</a>
				<div class="navbar-dropdown is-boxed">
					{#each variablePages as page}
					<NavbarSlugLink routeId="/variables/[slug]" {page}/>
					{/each}
					<!-- <hr class="navbar-divider"> -->
				</div>
			</div>

			<a href="/visualize" class="navbar-item" class:navbar-item-selected={isRoute('/visualize')}>
				Visualize
			</a>

			<a href="/help" class="navbar-item" class:navbar-item-selected={isRoute('/help')}>
				Help
			</a>
		</div>

		<!-- <div class="navbar-end">
		</div> -->
	</div>
</nav>
