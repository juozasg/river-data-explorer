<script lang="ts">
	import { page } from '$app/stores';
	import NavbarSlugLink from './NavbarSlugLink.svelte';

	// console.log(page);

	let variablePages = $state([]);

	const variablesPagePaths = async () => {
		const response = await fetch(`/api/variables`);
		return await response.json();
	}
	// const a = getVariableRoutes();
	$effect(async () => {
		const pagesPaths = await variablesPagePaths();
		console.log(pagesPaths);
		variablePages = pagesPaths;
	});

	const isRoute = (routeId: string) => $page.route?.id === routeId
</script>


<nav class="navbar is-fixed-top is-transparent" aria-label="main navigation">
	<div class="navbar-brand">
		<a class="navbar-item" href="/">
      <img src="/sjrbc-logo.png" alt="SJRBC Logo">
    </a>

		<a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
			<span aria-hidden="true"></span>
		</a>
	</div>

	<div class="navbar-menu">
		<div class="navbar-start">
			<a href="/" class="navbar-item is-active" class:navbar-item-selected={isRoute('/')}>
				Home
			</a>

			<a href="/about" class="navbar-item" class:navbar-item-selected={isRoute('/about')}>
				About
			</a>

			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link is-arrowless" class:navbar-item-selected={isRoute('/regions/[slug]')}>
					Regions
				</a>
				<div class="navbar-dropdown is-boxed">
					<a href="/regions/huc01" class="navbar-item">
						Watershed 01
					</a>
					<a href="/regions/huc02" class="navbar-item">
						Watershed 02
					</a>
				</div>
			</div>

			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link is-arrowless" class:navbar-item-selected={isRoute('/variables/[slug]')}>
					Variables
				</a>
				<div class="navbar-dropdown is-boxed">
					<!-- {#each variablePages as {slug, metadata}}
						<NavbarSlugLink routeId="/variables/[slug]" slug={slug} title={metadata.title}/>
					{/each} -->
				</div>
			</div>
		</div>
	</div>
</nav>

