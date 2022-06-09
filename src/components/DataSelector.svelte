<script lang="ts">
  import { fly } from 'svelte/transition';
  import Select, { Option } from '@smui/select';
  import List, { Item, Separator } from '@smui/list';
  import Fab, { Icon } from '@smui/fab';
  import { showDataSelector, dataVariable, selectedSites } from '../lib/stores';

  import { labels } from '../lib/data/definitions';
  import type { MenuComponentDev } from '@smui/menu';
  import Menu from '@smui/menu';

  let menu: MenuComponentDev;

  let selectionText: String;

  $: {
    if($selectedSites.length === 1) {
      selectionText = '1 site selected';
    } else if($selectedSites.length > 1) {
      selectionText = `${$selectedSites.length} sites selected`;
    } else {
      selectionText = '<i>Use map to select sites</i>';
    }
  }

  const addToSelection = () => {
		$selectedSites = [...$selectedSites, Math.random()];
	};
</script>


{#if $showDataSelector }
 <div class="elevation" id='data-selector'
        transition:fly="{{ x: -200, duration: 400 }}" style="position: fixed; bottom: 0; left: 0;">

    <img src='mockup.png' alt='legand mockup' width='360px'/>


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

    <div id='site-actions'>
      <div id='sites-status'>{@html selectionText}</div>

      <div class='site-action-icon'>
        <Fab color="secondary" mini on:click={() => menu.setOpen(true)}>
          <Icon class="material-icons">insights</Icon>
        </Fab>
      </div>

      <div class='site-action-icon'>
        <Fab color="secondary" mini on:click={() => $selectedSites = []}>
          <Icon class="material-icons">clear</Icon>
        </Fab>
      </div>

    </div>

    <Menu bind:this={menu} anchorCorner='BOTTOM_RIGHT'>
      <p class='menulist-title'>Graph Selected To</p>
      <List dense>
        <Separator />
        <Item selected={false} on:SMUI:action={() => addToSelection()}>
          <i class="text-icon material-icons" aria-hidden="true" style='margin-right: 0.5rem'>arrow_circle_left</i>
          Left Timeseries
        </Item>
        <Separator />
        <Item  on:SMUI:action={() => $selectedSites.pop()}>
          <i class="text-icon material-icons" aria-hidden="true" style='margin-right: 0.5rem'>arrow_circle_right</i>
          Right Timeseries
        </Item>
      </List>
    </Menu>

  </div>
{/if}


<style lang='scss'>
  #data-selector {
    width: 360px;
    height: 300px;
    padding: 1rem;

    background-color: white;
  }


  #data-variable-selector {
    position: absolute;
    top: 10px;
    left: 46px;
  }

  :global(#data-variable-selector ul) {
    overflow-y: auto;
    max-height: 80vh;
  }

  :global(.mdc-select__selected-text) {
    font-weight: 600;
  }


  img {
    position: absolute;
    top: 60px;
  }

  #site-actions {
    position: absolute;
    bottom: 0px;
    left: 46px;
    width: 300px;
    height: 56px;
    display: flex;
    align-items: end;
    justify-content: right;

    border-top: 1px solid #939393;

    #sites-status {
      font-size: 1.1rem;
      font-weight: 600;
      color: #9c27b0;
      // text-decoration: underline dotted;

      height: 40px;
    }

    .site-action-icon {
      padding-left: 0.5rem;
    }
  }

  :global(#data-selector .mdc-menu-surface) {
    width: 170px;
    bottom: 56px !important;
    left: 84px !important;
  }

  :global(#data-variable-selector .mdc-menu-surface) {
    width: 340px;
    position: fixed;
    bottom: 70px !important;
    left: 16px !important;
  }

</style>