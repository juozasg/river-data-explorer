<script lang="ts">
  import { fly } from 'svelte/transition';
  import Select, { Option } from '@smui/select';
  import List, { Item, Separator } from '@smui/list';
  import Fab, { Icon } from '@smui/fab';
  import Menu from '@smui/menu';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  import Legend from './Legend.svelte';
  import { showDashboard, showTimeseries, 
    selectedSeries, selectedSites, clearSelectedSites, 
    leftSeries, leftSites,
    rightSeries, rightSites } from '../lib/stores';
  import { labels, labelWithUnits } from '../lib/definitions';

  let menu: Menu;
  let selectionText: String;

  $: {
    if($selectedSites.size === 1) {
      selectionText = '1 site selected';
    } else if($selectedSites.size > 1) {
      selectionText = `${$selectedSites.size} sites selected`;
    } else {
      selectionText = '<i>Use map to select sites</i>';
    }
  }

  const graphLeft = () => {
    $showTimeseries = true;
    // $leftSites = new Set($selectedSites);
    const s = Array.from($selectedSites)
    $leftSites = new Set([s[s.length - 1]]);
    
    $leftSeries = $selectedSeries;
  };

  const graphRight = () => {
    $showTimeseries = true;
    // $rightSites = new Set($selectedSites);
    const s = Array.from($selectedSites)
    $rightSites = new Set([s[s.length - 1]]);
    
    $rightSeries = $selectedSeries;
  };
</script>


{#if $showDashboard }
  <div id='data-selector' class='elevation'
        transition:fly="{{ x: -200, duration: 400 }}">

    <Wrapper>
      <div id='data-variable-selector'>
        <Select bind:value={$selectedSeries} label="Variable" style='width:300px'>
          {#each Object.entries(labels) as [key, label]}
            <Option value={key}>{labelWithUnits(key)}</Option>

            {#if key === 'datainfo' || key === 'wet' || key === 'bodPercent' || key === 'invertMichigan' || key === 'ph'}
              <Separator />
            {/if}
          {/each}
        </Select>
      </div>
    </Wrapper>
    <Legend/>


    <div id='site-actions'>
      <div id='sites-status'>{@html selectionText}</div>

      <div class='site-action-icon'>
        <Wrapper>
          <Fab color="secondary" mini on:click={() => menu.setOpen(true)}>
            <Icon class="material-icons">insights</Icon>
          </Fab>
          <Tooltip showDelay={600} hideDelay={0} id="tooltip-addtimeseries">Add selected sites to the Timeseries View</Tooltip>
        </Wrapper>
      </div>

      <div class='site-action-icon'>
        <Wrapper>
          <Fab color="secondary" mini on:click={clearSelectedSites}>
            <Icon class="material-icons">clear</Icon>
          </Fab>
          <Tooltip hideDelay={0} id="tooltip-unselect">Unselect all sites</Tooltip>
        </Wrapper>
      </div>
    </div>

    <Menu bind:this={menu} anchorCorner='BOTTOM_RIGHT'>
      <p class='menulist-title'>Graph Selected To</p>
      <List dense>
        <Separator />
        <Item on:SMUI:action={graphLeft}>
          <i class="text-icon material-icons" aria-hidden="true" style='margin-right: 0.5rem'>arrow_circle_left</i>
          Left Timeseries
        </Item>
        <Separator />
        <Item on:SMUI:action={graphRight}>
          <i class="text-icon material-icons" aria-hidden="true" style='margin-right: 0.5rem'>arrow_circle_right</i>
          Right Timeseries
        </Item>
      </List>
    </Menu>

  </div>
{/if}


<style lang='scss'>
  #data-selector {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;

    width: 360px;
    height: 260px;
    padding: 1rem;
    background-color: white;

    // pack them in
    @media (max-width: 380px) {
      padding-left: 0;
    }
    @media (max-width: 340px) {
      margin-left: -20px;
    }
  }

  #data-variable-selector {
    // position: absolute;
    // top: 10px;
    // left: 46px;
    // margin-left: 30px;
    margin-top: 0px;

    display: flex;
    justify-content: center;
  }

  :global(#data-variable-selector ul) {
    overflow-y: auto;
    max-height: 80vh;
  }

  :global(.mdc-select__selected-text) {
    font-weight: 600;
  }

  :global(#tooltip-addtimeseries) {
    top: auto !important;
    left: 180px !important;
    bottom: 3.5rem;
  }


  :global(#tooltip-unselect) {
    top: auto !important;
    left: 270px !important;
    bottom: 3.5rem;
  }


  #site-actions {
    position: absolute;
    bottom: 0px;
    left: 30px;
    width: 300px;
    height: 56px;
    margin-left: 1rem;
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