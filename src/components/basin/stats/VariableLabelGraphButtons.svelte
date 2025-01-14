<script lang="ts">

	interface Pros {
		r: { varname: string; numObservations: number };
		onVarClicked: (name: string, axis: "y" | "z") => void;
	}
	let { onVarClicked, r }: Props = $props();
</script>

<div class="graph-buttons">
	<a
		class="graph-button y"
		onclick={(e) => {
			if (r.numObservations > 0) onVarClicked(r.varname, "y");
			e.stopPropagation();
		}}>Y</a>
	<a
		class="graph-button z"
		onclick={(e) => {
			if (r.numObservations > 0) onVarClicked(r.varname, "z");
			e.stopPropagation();
		}}>Z</a>
</div>
