<script lang="ts">
  import { selectedArea } from '$src/appstate/map/featureState.svelte';

  import SiteSelect from './SiteSelect.svelte';
  import VariablesSelect from './VariablesSelect.svelte';
</script>

<div class="level">
  {#if selectedArea.feature}
  <div class="level-left">
    <div class="level-item">
      <p class="subtitle is-5"><strong>HUC10:</strong> {selectedArea.description} <a href="#section-select-area">Change</a></p>
    </div>
  </div>

  <div class="level-right">
    <div class="level-item">
      <!-- <SiteSelect/> -->
    </div>
    <div class="level-item">
      <!-- <VariablesSelect/> -->
    </div>
  </div>

  {:else}

  <div class="level-left">
    <div class="level-item">
      <p class="subtitle is-5"><a href="#section-select-area"></a></p>
    </div>
  </div>

  {/if}

</div>

<style>
</style>

