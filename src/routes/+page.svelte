<script lang="ts">
  import { vv, counter } from '$src/value.svelte.js'

  import A from '$src/components/A.svelte';
  import B from '$src/components/B.svelte';


</script>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation. vvs = {vv}</p>


<pre>Trying state {counter.count}</pre>


<A/>
<hr/>
<B/>
