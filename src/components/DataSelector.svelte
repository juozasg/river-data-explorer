<script lang="ts">
  import { fly } from 'svelte/transition';
  import Select, { Option } from '@smui/select';
  import List, { Item, PrimaryText, SecondaryText, Separator, Text } from '@smui/list';
  import Fab, { Icon } from '@smui/fab';


  import { showDataSelector, dataVariable } from '../lib/stores';

  import { labels } from '../lib/data/definitions';
  import IconButton from '@smui/icon-button';
import type { MenuComponentDev } from '@smui/menu';
import Menu from '@smui/menu';
import { loop_guard } from 'svelte/internal';

  console.log($dataVariable);

  let menu: MenuComponentDev;

  
</script>

<style lang='scss'>
  #data-selector {
    width: 360px;
    height: 300px;
    padding: 1rem;

    background-color: white;

    i.text-icon {
      position: relative;
      top: 5px;
    }
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
    bottom: 6px;
    right: 80px;
    #site-action-icon {
      position: absolute;
      right: -50px;
      bottom: 0px;
      // color: darkblue;
      
    }
  }

  h4 {
    font-weight: 400;
  }

  :global(#data-variable-selector .mdc-menu-surface) {
    max-width: 360px;
    position: fixed;
    bottom: 60px !important;
    left: 16px !important;
  }

</style>

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
      <h4>2 sites selected</h4>
      <div id='site-action-icon'>
        <!-- <IconButton color="primary" class="material-icons" on:click={() => menu.setOpen(true)}>
          playlist_add
        </IconButton> -->

        <Fab color="primary" mini on:click={() => menu.setOpen(true)}>
          <Icon class="material-icons">playlist_add</Icon>
        </Fab>
      </div>
    </div>

    <Menu bind:this={menu}>
      <p class='menulist-title'>Sites Actions</p>
      <List twoLine>
        <Separator />
        <Item selected={false} on:SMUI:action={() => console.log('graph left')}>
          <Text>
            <PrimaryText>         
              <!-- <i class="text-icon material-icons" aria-hidden="true">filter_alt</i> -->
              Graph Left Timeseries
            </PrimaryText>
            <SecondaryText>Graph the selected sites and variables</SecondaryText>
          </Text>
        </Item>
        <Item >
          <Text>
            <PrimaryText>
              <!-- <i class="text-icon material-icons" aria-hidden="true">insights</i> -->
              Graph Right Timeseries
            </PrimaryText>
            <SecondaryText>Graph the selected sites and variables</SecondaryText>
          </Text>
        </Item>
        <Separator />
        <Item >
          <Text>
            <PrimaryText>
              <!-- <i class="text-icon material-icons" aria-hidden="true">list</i> -->
              Clear Selection
            </PrimaryText>
            <SecondaryText>Unselect all selected sites</SecondaryText>
          </Text>
        </Item>
      </List>
    </Menu>

  </div>
{/if}