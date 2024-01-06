<script lang="ts">

  import { counter } from '$src/value.svelte.js';

  let {foo = "default"} = $props();
</script>



<h3>A</h3>
<pre>
  A sees counter count: {counter.count}
  foo prop is {foo}

  <button onclick={counter.increment}>A+</button>
</pre>
