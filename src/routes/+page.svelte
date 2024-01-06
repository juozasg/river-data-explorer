<script lang="ts">
  import { vv, counter } from '$src/value.svelte'

  import A from '$src/components/A.svelte';
  import B from '$src/components/B.svelte';
</script>

<h1>Welcome to the new website 'Home Page'</h1>
<!-- svelte-ignore a11y-distracting-elements -->
<marquee>🚧🏗️ UNDER CONSTRUCTION... 🏗️🚧</marquee>

<pre>Trying state {counter.count}</pre>


<A foo={"no way"}/>
<hr/>

<B/>

<style lang="scss">
  marquee {
    color: orange;
    font-size: 30px;
    max-width: 630px;
  }
</style>
