<script lang="ts">
	import { mdiHelpCircleOutline as helpCircle} from '@mdi/js';

	import { page } from '$app/stores';
	import type { MarkdownPage } from '$src/lib/types/page';
	import NavbarSlugLink from './NavbarSlugLink.svelte';
	import { slide, fade } from 'svelte/transition';
	let transKey = {}


	interface Props {
    regionPages: MarkdownPage[]
    variablePages: MarkdownPage[]
  }

	const { regionPages, variablePages } = $props<Props>();

	const isRoute = (routeId: string) => $page.route?.id === routeId

	let burgerActive = $state(true);
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

	{#key transKey}
	<div class="navbar-menu"
				transition:fly={{duration: 1000}}
				class:is-active={burgerActive}>
		<div class="navbar-start">
			<a href="/" class="navbar-item" class:navbar-item-selected={isRoute('/')}>
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
					{#each regionPages as page}
						<NavbarSlugLink routeId="/regions/[slug]" {page}/>
					{/each}
				</div>
			</div>

			<div class="navbar-item has-dropdown is-hoverable">
				<a class="navbar-link is-arrowless" class:navbar-item-selected={isRoute('/variables/[slug]')}>
					Variables
				</a>
				<div class="navbar-dropdown is-boxed">
					{#each variablePages as page}
						<NavbarSlugLink routeId="/variables/[slug]" {page}/>
					{/each}
				</div>
			</div>
		</div>

		<div class="navbar-end">
			<hr/>
			<a class="navbar-item help">
				<span class="text">Help</span>
				<svg class="" style="width: 36px;" viewBox="0 0 24 24">
					<path d={helpCircle} />
				</svg>
			</a>
		</div>
	</div>
	{/key}
</nav>
