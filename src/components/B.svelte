<script lang="ts">
  import { counter } from '$src/value.svelte.js';
</script>

<h3>B</h3>
<pre>
  B sees counter count: {counter.count}

  <button onclick={counter.increment}>B+</button>
</pre>
