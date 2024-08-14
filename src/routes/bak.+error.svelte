<script lang="ts">
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
	const err = $page.error as any;
</script>

<h1>🚨 ERROR 🚨 ERROR 🚨</h1>
<h1>{$page.error?.message}</h1>


<pre>
	{err.error?.frame}
</pre>

<pre>
	{JSON.stringify($page.error, null, 2)}
</pre>


<pre>
	{err.error?.stack || 'No stack' }
</pre>
