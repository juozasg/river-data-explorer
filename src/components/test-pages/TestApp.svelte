<script lang="ts">
	type Props = {
		testName?: string;
	};

	const { testName }: Props = $props();
</script>


<main>
	<h1>{testName}</h1>
</main>