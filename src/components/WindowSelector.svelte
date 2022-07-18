<script lang="ts">
  import type { MenuComponentDev } from '@smui/menu';
  import Menu from '@smui/menu';
  import List, { Item, PrimaryText, SecondaryText, Separator, Text } from '@smui/list';
  import { Icon } from '@smui/button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import Fab from '@smui/fab';

  import { showDataSelector, showTimeseries, showDataTable, viewportWidth, viewportHeight } from '../lib/stores';

  let menu: MenuComponentDev;

  const toggleDataSelector = () => {
    $showDataSelector = !$showDataSelector

    // at least 780 width to fit DS and TS
    if($showDataSelector && $viewportWidth < 780) {
      $showTimeseries = false;
    }

    if($showDataSelector && $viewportHeight < 640) {
      $showDataTable = false;
    }
  }

  const toggleTimeseries = () => {
    $showTimeseries = !$showTimeseries

    // at least 780 width to fit DS and TS
    if($showTimeseries && $viewportWidth < 780) {
      $showDataSelector = false;
    }

    if($showTimeseries && $viewportHeight < 640) {
      $showDataTable = false;
    }
  }

  const toggleDataTable = () => {
    $showDataTable = !$showDataTable

    if($showDataTable && $viewportHeight < 640) {
      console.log('hide your wives');

      $showDataSelector = false;
      $showTimeseries = false;
    }
  }

</script>

<div id='window-selector' style="position: fixed; left: 4px; bottom: 0px; z-index:20000">
  <Wrapper>
    <Fab color="primary" mini on:click={() => menu.setOpen(true)}>
      <Icon class="material-icons">apps</Icon>
    </Fab>
    <Tooltip id="tooltip-dataviews" style='z-index: 20001'>Show and hide data views</Tooltip>
  </Wrapper>

  <Menu bind:this={menu}>
    <p class='menulist-title'>Data Views</p>

    <List twoLine>
      <Separator />
      <Item selected={$showDataSelector} on:SMUI:action={toggleDataSelector}>
        <Text>
          <PrimaryText>
            <i class="text-icon material-icons" aria-hidden="true">filter_alt</i>
            Selector
          </PrimaryText>
          <SecondaryText>Select variables and sites. Show data legend</SecondaryText>
        </Text>
      </Item>
      <Item selected={$showTimeseries} on:SMUI:action={toggleTimeseries}>
        <Text>
          <PrimaryText>
            <i class="text-icon material-icons" aria-hidden="true">insights</i>
            Time Series
          </PrimaryText>
          <SecondaryText>Graph selected sites and variables</SecondaryText>
        </Text>
      </Item>
      <Item selected={$showDataTable} on:SMUI:action={toggleDataTable}>
        <Text>
          <PrimaryText>
            <i class="text-icon material-icons" aria-hidden="true">list</i>
            Summary Table
          </PrimaryText>
          <SecondaryText>Statistics for selected sites and variables</SecondaryText>
        </Text>
      </Item>
    </List>
  </Menu>
</div>

<style>
  i.text-icon {
    position: relative;
    top: 6px;
  }

  :global(#window-selector .mdc-menu-surface) {
    /* width: 200px; */
    bottom: 56px !important;
    left: 20px !important;
  }

  :global(#tooltip-dataviews) {
    top: auto !important;
    left: 20px !important;
    bottom: 3.5rem;
  }
</style>