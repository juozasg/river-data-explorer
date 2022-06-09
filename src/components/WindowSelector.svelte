<script lang="ts">
  import type { MenuComponentDev } from '@smui/menu';
  import Menu from '@smui/menu';
  import List, { Item, PrimaryText, SecondaryText, Separator, Text } from '@smui/list';
  import Button, { Icon, Label } from '@smui/button';
  import IconButton from '@smui/icon-button';

  import { showDataSelector } from '../lib/stores';
  import Fab from '@smui/fab';
 
  let menu: MenuComponentDev;

  let clicked = '';
</script>



<div id='window-selector' style="position: fixed; left: 4px; bottom: 0px; z-index:20000">
  <Fab color="primary" mini on:click={() => menu.setOpen(true)}>
    <Icon class="material-icons">apps</Icon>
  </Fab>

  <Menu bind:this={menu}>
    <p class='menulist-title'>Data Views</p>

    <List twoLine>
      <Separator />
      <Item selected={$showDataSelector} on:SMUI:action={() => $showDataSelector = !$showDataSelector }>
        <Text>
          <PrimaryText>         
            <i class="text-icon material-icons" aria-hidden="true">filter_alt</i>
            Selector
          </PrimaryText>
          <SecondaryText>Select variables and sites. Show data legend</SecondaryText>
        </Text>
      </Item>
      <Item on:SMUI:action={() => (clicked = 'Copy')}>
        <Text>
          <PrimaryText>
            <i class="text-icon material-icons" aria-hidden="true">insights</i>
            Time Series
          </PrimaryText>
          <SecondaryText>Graph selected sites and variables</SecondaryText>
        </Text>
      </Item>
      <Item on:SMUI:action={() => (clicked = 'Paste')}>
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
</style>