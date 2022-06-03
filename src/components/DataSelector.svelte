<script lang="ts">
  import { fly } from 'svelte/transition';
  import Select, { Option } from '@smui/select';
  import { Separator } from '@smui/list';

  import { showDataSelector, dataVariable } from '../lib/stores';

  import { labels } from '../lib/data/definitions';

  console.log($dataVariable);
  
</script>

<style lang='scss'>
  #data-selector {
    width: 360px;
    height: 400px;
    padding: 1rem;

    background-color: white;
  }


  #data-variable-selector {
    position: absolute;
    bottom: 10px;
    left: 60px;
  }

  :global(#data-variable-selector ul) {
    overflow-y: scroll;
    max-height: 80vh;
  }

</style>

{#if $showDataSelector }


  <div class="elevation" id='data-selector'
        transition:fly="{{ x: -200, duration: 400 }}" style="position: fixed; bottom: 0; left: 0;">
    <div style="margin: 1em;">
      This is a Data Selector
      <pre>selected: {$dataVariable}</pre>
    </div>


    <div id='data-variable-selector'>
      <Select bind:value={$dataVariable} label="Variable" style='width:300px'>
        {#each Object.entries(labels) as [key, label]}
          <Option value={key}>{label}</Option>
          
          {#if key === 'datainfo' || key === 'height'}
            <Separator />
          {/if}
        {/each}
      </Select>    
    </div>


  </div>
{/if}