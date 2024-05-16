<script lang="ts">
  import { selectedArea } from '$src/state/areas.svelte';

  import SiteSelect from './SiteSelect.svelte';
	import VariablesSelect from './VariablesSelect.svelte';
</script>

<div class="level">
  {#if selectedArea.feature}
  <div class="level-left">
    <div class="level-item">

      <p class="subtitle is-5"><strong>{selectedArea.description}</strong></p>
    </div>
  </div>

  <div class="level-right">
    <div class="level-item">
      <SiteSelect/>
    </div>
    <div class="level-item">
      <VariablesSelect/>
    </div>
  </div>


  {/if}

</div>

<style>
</style>

