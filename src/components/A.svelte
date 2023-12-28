<script lang="ts">
  import { counter } from '$src/value.svelte.js';
</script>


<h3>A</h3>
<pre>
  A sees counter count: {counter.count}

  <button onclick={counter.increment}>A+</button>
</pre>
