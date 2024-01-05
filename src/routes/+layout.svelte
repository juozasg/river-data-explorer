<script lang="ts">
    // import { preloadCode, preloadData } from '$app/navigation';
    // preloadCode('/blog', '/about', '/blog/*');
    // // OR:
    // preloadData('/blog', '/about', '/variables/*');
    // TODO: test out performance of preloading everything vs some things

    import '@picocss/pico/css/pico.css'
    import '$lib/styles/global.scss'
	import SiteNavMenu from '$src/components/SiteNavMenu.svelte';
</script>

<header>
    <SiteNavMenu />
</header>

<main>
    <slot />
</main>
