<script lang="ts">
  import type { MenuComponentDev } from '@smui/menu';
  import Menu from '@smui/menu';
  import List, { Item, PrimaryText, SecondaryText, Separator, Text } from '@smui/list';
  import Button, { Icon, Label } from '@smui/button';
  import IconButton from '@smui/icon-button';

  import { showDataSelector } from '../lib/stores';
 
  let menu: MenuComponentDev;
</script>



<div style="position: fixed; left: 4px; bottom: 0px; z-index:20000">
  <IconButton color="primary" class="material-icons" on:click={() => menu.setOpen(true)}>
    apps
  </IconButton>

  <Menu bind:this={menu}>
    <p class='dataview-title'>Data Views</p>

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
  p.dataview-title {
    margin: 0.5rem 0 -0.5rem 1rem;
    font-size: 1rem;
    font-weight: 600;
  }

  i.text-icon {
    position: relative;
    top: 6px;
  }
</style>