<script lang="ts">
    import '$lib/styles/global.scss'
	import SiteNavMenu from '$src/components/SiteNavMenu.svelte';
</script>

<header>
    <SiteNavMenu />
</header>

<main>
    <slot />
</main>
